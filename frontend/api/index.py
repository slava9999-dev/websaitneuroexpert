"""FastAPI entry point for Vercel serverless deployment."""

import asyncio
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import backend modules
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.config.settings import settings
from backend.utils.database import db_manager
from backend.routes import chat, contact

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for Vercel deployment."""
    # Startup
    logger.info("Starting NeuroExpert API on Vercel...")
    
    # Connect to database
    db_connected = await db_manager.connect()
    if not db_connected:
        logger.error("Failed to connect to database")
    
    logger.info("API startup complete")
    
    yield
    
    # Shutdown (limited in serverless)
    logger.info("API shutdown")


# Create FastAPI app
app = FastAPI(
    title="NeuroExpert API",
    description="AI-powered digital transformation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Vercel
allowed_origins = []
if settings.environment == "development":
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
else:
    # Production - use configured origin
    if settings.client_origin_url:
        allowed_origins = [settings.client_origin_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log requests with timing for monitoring."""
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
    """API root endpoint."""
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
    """Comprehensive health check for monitoring."""
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
            "version": "1.0.0"
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
    """Handle uncaught exceptions gracefully."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# Vercel serverless handler
handler = app
