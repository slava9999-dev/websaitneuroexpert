"""Security middleware for FastAPI application."""

import time
import hashlib
import secrets
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Response
from starlette.middleware.base import BaseHTTPMiddleware
from ..config.settings import settings

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request and add security headers."""
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # HSTS in production
        if settings.environment == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
        # Permissions Policy
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), "
            "payment=(), usb=(), magnetometer=(), gyroscope=()"
        )
        
        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Validate incoming requests for security."""
    
    def __init__(self, app, max_content_length: int = 10 * 1024 * 1024):  # 10MB
        super().__init__(app)
        self.max_content_length = max_content_length
    
    async def dispatch(self, request: Request, call_next):
        """Validate request before processing."""
        # Check content length
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_content_length:
            raise HTTPException(
                status_code=413,
                detail=f"Request entity too large. Maximum size is {self.max_content_length} bytes"
            )
        
        # Check for suspicious patterns
        await self._validate_request_headers(request)
        
        # Process request
        return await call_next(request)
    
    async def _validate_request_headers(self, request: Request):
        """Validate request headers for security issues."""
        user_agent = request.headers.get("user-agent", "")
        
        # Block suspicious user agents
        suspicious_agents = [
            "sqlmap", "nikto", "nmap", "masscan", "zap", "burp",
            "scanner", "crawler", "bot", "spider"
        ]
        
        if any(agent in user_agent.lower() for agent in suspicious_agents):
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        
        # Check for common attack patterns
        suspicious_headers = [
            "x-forwarded-for", "x-real-ip", "x-originating-ip"
        ]
        
        for header in suspicious_headers:
            if header in request.headers:
                value = request.headers[header]
                # Check for IP injection attempts
                if any(char in value for char in ["'", '"', ';', '..', '\\']):
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid header format"
                    )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Enhanced request logging for security monitoring."""
    
    def __init__(self, app, log_body: bool = False):
        super().__init__(app)
        self.log_body = log_body
    
    async def dispatch(self, request: Request, call_next):
        """Log request details for security monitoring."""
        start_time = time.time()
        
        # Collect request information
        request_data = {
            "method": request.method,
            "url": str(request.url),
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": self._get_client_ip(request),
            "user_agent": request.headers.get("user-agent", ""),
            "content_type": request.headers.get("content-type", ""),
            "content_length": request.headers.get("content-length", "0"),
            "timestamp": time.time()
        }
        
        # Log suspicious requests
        if self._is_suspicious_request(request):
            request_data["suspicious"] = True
            print(f"🚨 Suspicious request: {request_data}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response information
        response_data = {
            "status_code": response.status_code,
            "process_time": process_time
        }
        
        # Combine and log
        log_data = {**request_data, **response_data}
        
        # Log slow requests
        if process_time > 5.0:  # 5 seconds
            log_data["slow"] = True
            print(f"🐌 Slow request: {log_data}")
        
        # Log errors
        if response.status_code >= 400:
            log_data["error"] = True
            print(f"❌ Error response: {log_data}")
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Get real client IP address."""
        # Check for proxy headers
        forwarded_for = request.headers.get("X-Forwarded-For")
        real_ip = request.headers.get("X-Real-IP")
        
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        elif real_ip:
            return real_ip
        else:
            return request.client.host or "unknown"
    
    def _is_suspicious_request(self, request: Request) -> bool:
        """Check if request is suspicious."""
        path = request.url.path.lower()
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Suspicious paths
        suspicious_paths = [
            "/admin", "/wp-admin", "/phpmyadmin", "/.env",
            "/config", "/backup", "/test", "/debug"
        ]
        
        # Suspicious user agents
        suspicious_agents = [
            "sqlmap", "nikto", "nmap", "scanner", "bot"
        ]
        
        return (
            any(sus_path in path for sus_path in suspicious_paths) or
            any(sus_agent in user_agent for sus_agent in suspicious_agents)
        )


class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """CSRF protection middleware."""
    
    def __init__(self, app, exclude_methods: list = ["GET", "HEAD", "OPTIONS"]):
        super().__init__(app)
        self.exclude_methods = exclude_methods
        self.csrf_tokens: Dict[str, Dict[str, Any]] = {}
    
    async def dispatch(self, request: Request, call_next):
        """Process request with CSRF protection."""
        # Skip CSRF for safe methods
        if request.method in self.exclude_methods:
            return await call_next(request)
        
        # Skip CSRF for API endpoints (use CORS instead)
        if request.url.path.startswith("/api/"):
            return await call_next(request)
        
        # Check CSRF token
        client_id = self._get_client_id(request)
        csrf_token = request.headers.get("X-CSRF-Token")
        
        if not csrf_token or not self._validate_csrf_token(client_id, csrf_token):
            raise HTTPException(
                status_code=403,
                detail="Invalid CSRF token"
            )
        
        return await call_next(request)
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier for CSRF token."""
        # Use session ID or IP address
        session_id = request.headers.get("X-Session-ID")
        if session_id:
            return f"session:{session_id}"
        
        # Fallback to IP
        client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        return f"ip:{client_ip}" if client_ip else "unknown"
    
    def _validate_csrf_token(self, client_id: str, token: str) -> bool:
        """Validate CSRF token."""
        if client_id not in self.csrf_tokens:
            return False
        
        token_data = self.csrf_tokens[client_id]
        
        # Check if token is expired (30 minutes)
        if time.time() - token_data["created"] > 1800:
            del self.csrf_tokens[client_id]
            return False
        
        # Validate token
        expected_token = token_data["token"]
        return secrets.compare_digest(token, expected_token)
    
    def generate_csrf_token(self, client_id: str) -> str:
        """Generate new CSRF token for client."""
        token = secrets.token_urlsafe(32)
        self.csrf_tokens[client_id] = {
            "token": token,
            "created": time.time()
        }
        return token


class InputSanitizationMiddleware(BaseHTTPMiddleware):
    """Sanitize input data to prevent XSS and injection attacks."""
    
    async def dispatch(self, request: Request, call_next):
        """Sanitize request data."""
        # Only process POST/PUT/PATCH requests
        if request.method not in ["POST", "PUT", "PATCH"]:
            return await call_next(request)
        
        # Check content type
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            # Sanitize JSON body
            await self._sanitize_json_body(request)
        elif "application/x-www-form-urlencoded" in content_type:
            # Sanitize form data
            await self._sanitize_form_data(request)
        
        return await call_next(request)
    
    async def _sanitize_json_body(self, request: Request):
        """Sanitize JSON request body."""
        try:
            body = await request.json()
            
            # Recursively sanitize string values
            sanitized_body = self._sanitize_dict(body)
            
            # Replace request body
            request._body = sanitized_body
        except Exception:
            # If we can't parse JSON, let the request continue
            # It will be handled by the endpoint validation
            pass
    
    async def _sanitize_form_data(self, request: Request):
        """Sanitize form data."""
        try:
            form_data = await request.form()
            sanitized_data = {}
            
            for key, value in form_data.items():
                if isinstance(value, str):
                    sanitized_data[key] = self._sanitize_string(value)
                else:
                    sanitized_data[key] = value
            
            # Replace form data
            request._form = sanitized_data
        except Exception:
            pass
    
    def _sanitize_dict(self, data: Any) -> Any:
        """Recursively sanitize dictionary values."""
        if isinstance(data, dict):
            return {k: self._sanitize_dict(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._sanitize_dict(item) for item in data]
        elif isinstance(data, str):
            return self._sanitize_string(data)
        else:
            return data
    
    def _sanitize_string(self, text: str) -> str:
        """Sanitize string to prevent XSS."""
        # Remove potentially dangerous characters
        dangerous_chars = ["<", ">", "&", '"', "'", "/", "\\"]
        
        sanitized = text
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")
        
        # Remove script tags and event handlers
        script_patterns = [
            "javascript:", "vbscript:", "data:", "onload=", "onerror=",
            "onclick=", "onmouseover=", "onfocus=", "onblur="
        ]
        
        for pattern in script_patterns:
            sanitized = sanitized.replace(pattern, "")
        
        return sanitized.strip()
