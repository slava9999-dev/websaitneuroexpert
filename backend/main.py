"""Main FastAPI application for NeuroExpert backend."""

import asyncio
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

from config.settings import settings
from utils.database import db_manager
from routes import chat, contact

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Sentry for error monitoring
if settings.sentry_dsn and settings.environment == "production":
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(),
            LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR
            ),
        ],
        traces_sample_rate=1.0,
        environment=settings.environment,
        release="neuroexpert@3.0.0",
    )
    logger.info("Sentry initialized for error monitoring")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting NeuroExpert backend...")
    
    # Connect to database
    db_connected = await db_manager.connect()
    if not db_connected:
        logger.error("Failed to connect to database")
    else:
        # Create indexes for performance
        await db_manager.create_indexes()
    
    logger.info("Backend startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down NeuroExpert backend...")
    await db_manager.disconnect()
    logger.info("Backend shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="NeuroExpert API",
    description="AI-powered digital transformation platform backend",
    version="3.0.0",
    lifespan=lifespan
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
allowed_origins = []
if settings.environment == "development":
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
else:
    # In production, use configured origin
    if settings.client_origin_url:
        allowed_origins = [settings.client_origin_url]
    # Add production domains
    allowed_origins.extend([
        "https://neuroexpert.ru",
        "https://www.neuroexpert.ru",
        "https://neuroexpert.vercel.app"
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Только конкретные домены
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Только необходимые методы
    allow_headers=["Content-Type", "Authorization"],  # Только необходимые headers
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing."""
    start_time = datetime.utcnow()
    
    response = await call_next(request)
    
    process_time = (datetime.utcnow() - start_time).total_seconds()
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response


# Include routers
app.include_router(chat.router)
app.include_router(contact.router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "name": "NeuroExpert API",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "contact": "/api/contact"
        }
    }


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Comprehensive health check for all services."""
    try:
        # Database health
        db_health = await db_manager.health_check()
        
        # Overall status
        overall_status = "healthy" if db_health["status"] == "healthy" else "degraded"
        
        return {
            "status": overall_status,
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.environment,
            "services": {
                "database": db_health,
                "api": {"status": "healthy"}
            },
            "version": "3.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "timestamp": datetime.utcnow().isoformat()
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development"
    )
