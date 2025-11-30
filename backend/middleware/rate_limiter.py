"""Rate limiting middleware for API endpoints."""

import time
import asyncio
from typing import Dict, Optional
from fastapi import Request, HTTPException, Response
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict, deque
from ..config.settings import settings

class RateLimiter(BaseHTTPMiddleware):
    """Simple in-memory rate limiter for API endpoints."""
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        """
        Initialize rate limiter.
        
        Args:
            app: FastAPI application
            calls: Number of allowed calls per period
            period: Time period in seconds
        """
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients: Dict[str, deque] = defaultdict(deque)
        
    async def dispatch(self, request: Request, call_next):
        """Process request with rate limiting."""
        # Get client identifier
        client_id = self._get_client_id(request)
        
        # Check rate limit
        if not self._is_allowed(client_id):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(self.period)}
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = self._get_remaining_calls(client_id)
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + self.period)
        
        return response
    
    def _get_client_id(self, request: Request) -> str:
        """Get unique client identifier."""
        # Try to get real IP from headers
        forwarded_for = request.headers.get("X-Forwarded-For")
        real_ip = request.headers.get("X-Real-IP")
        
        if forwarded_for:
            # X-Forwarded-For can contain multiple IPs, take the first one
            return forwarded_for.split(",")[0].strip()
        elif real_ip:
            return real_ip
        else:
            # Fallback to client host
            return request.client.host
    
    def _is_allowed(self, client_id: str) -> bool:
        """Check if client is allowed to make request."""
        now = time.time()
        client_requests = self.clients[client_id]
        
        # Remove old requests outside the time window
        while client_requests and client_requests[0] <= now - self.period:
            client_requests.popleft()
        
        # Check if client has exceeded the limit
        if len(client_requests) >= self.calls:
            return False
        
        # Add current request
        client_requests.append(now)
        return True
    
    def _get_remaining_calls(self, client_id: str) -> int:
        """Get remaining allowed calls for client."""
        now = time.time()
        client_requests = self.clients[client_id]
        
        # Remove old requests outside the time window
        while client_requests and client_requests[0] <= now - self.period:
            client_requests.popleft()
        
        return max(0, self.calls - len(client_requests))


class AdvancedRateLimiter(BaseHTTPMiddleware):
    """Advanced rate limiter with different limits per endpoint."""
    
    def __init__(self, app):
        super().__init__(app)
        # Define rate limits per endpoint pattern
        self.rate_limits = {
            "/api/chat": {"calls": 20, "period": 60},  # 20 requests per minute
            "/api/contact": {"calls": 5, "period": 300},  # 5 requests per 5 minutes
            "/api/health": {"calls": 100, "period": 60}, # 100 requests per minute
            "default": {"calls": 100, "period": 60}       # Default limit
        }
        self.limiters: Dict[str, RateLimiter] = {}
        
        # Create rate limiters for each endpoint pattern
        for pattern, config in self.rate_limits.items():
            self.limiters[pattern] = RateLimiter(app, config["calls"], config["period"])
    
    async def dispatch(self, request: Request, call_next):
        """Process request with endpoint-specific rate limiting."""
        # Find matching rate limiter
        limiter = self._get_rate_limiter(request.url.path)
        
        # Check rate limit
        client_id = limiter._get_client_id(request)
        if not limiter._is_allowed(client_id):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(limiter.period)}
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = limiter._get_remaining_calls(client_id)
        response.headers["X-RateLimit-Limit"] = str(limiter.calls)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + limiter.period)
        
        return response
    
    def _get_rate_limiter(self, path: str) -> RateLimiter:
        """Get rate limiter for the given path."""
        # Check for exact matches first
        if path in self.limiters:
            return self.limiters[path]
        
        # Check for pattern matches
        for pattern, limiter in self.limiters.items():
            if pattern != "default" and path.startswith(pattern):
                return limiter
        
        # Return default limiter
        return self.limiters["default"]


# Redis-based rate limiter (for production)
class RedisRateLimiter(BaseHTTPMiddleware):
    """Redis-based distributed rate limiter for production use."""
    
    def __init__(self, app, redis_client, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.redis = redis_client
        self.calls = calls
        self.period = period
    
    async def dispatch(self, request: Request, call_next):
        """Process request with Redis-based rate limiting."""
        if not self.redis:
            # Fallback to in-memory if Redis not available
            return await call_next(request)
        
        client_id = self._get_client_id(request)
        key = f"rate_limit:{client_id}:{request.url.path}"
        
        try:
            # Use Redis atomic operations for rate limiting
            current = await self.redis.incr(key)
            
            if current == 1:
                # Set expiration on first request
                await self.redis.expire(key, self.period)
            
            if current > self.calls:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later.",
                    headers={"Retry-After": str(self.period)}
                )
            
            # Process request
            response = await call_next(request)
            
            # Add rate limit headers
            remaining = max(0, self.calls - current)
            response.headers["X-RateLimit-Limit"] = str(self.calls)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + self.period)
            
            return response
            
        except Exception as e:
            # Log error but allow request through
            print(f"Rate limiter error: {e}")
            return await call_next(request)
    
    def _get_client_id(self, request: Request) -> str:
        """Get unique client identifier."""
        forwarded_for = request.headers.get("X-Forwarded-For")
        real_ip = request.headers.get("X-Real-IP")
        
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        elif real_ip:
            return real_ip
        else:
            return request.client.host
