"""Contact form API routes."""

import asyncio
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, validator
from slowapi import Limiter
from slowapi.util import get_remote_address
from utils.database import db_manager
from utils.telegram import TelegramNotifier
from config.settings import settings

logger = logging.getLogger(__name__)

# Initialize rate limiter for this router
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api", tags=["contact"])


class ContactRequest(BaseModel):
    name: str
    contact: str
    service: str
    message: str = ""

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()

    @validator('contact')
    def validate_contact(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('Contact information is required')
        return v.strip()

    @validator('service')
    def validate_service(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Service selection is required')
        return v.strip()


class ContactResponse(BaseModel):
    success: bool
    message: str
    timestamp: str


@router.post("/contact", response_model=ContactResponse)
@limiter.limit("5/minute")
async def contact_form(request: Request, body: ContactRequest):
    """Handle contact form submissions with database storage and Telegram notifications.
    
    Rate limit: 5 requests per minute per IP address.
    """
    timestamp = datetime.utcnow()
    
    try:
        # Validate required fields
        if not all([body.name, body.contact, body.service]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Save to database (optional)
        try:
            db_success = await db_manager.save_contact_form(
                body.name, body.contact, body.service, body.message
            )
            if not db_success:
                logger.warning("Failed to save contact form to database")
        except Exception as e:
            logger.error(f"Database save error: {e}")
            # Continue execution to send Telegram notification
        
        # Send Telegram notification
        telegram_success = False
        if settings.telegram_bot_token and settings.telegram_chat_id:
            try:
                notifier = TelegramNotifier()
                telegram_success = await notifier.send_contact_notification(
                    body.name, body.contact, body.service, body.message
                )
            except Exception as e:
                logger.error(f"Telegram notification failed: {e}")
        else:
            logger.info("Telegram not configured - skipping notification")
        
        # Log the submission
        logger.info(f"Contact form submitted: {body.name} - {body.service}")
        
        # Return success response
        response = ContactResponse(
            success=True,
            message="Спасибо! Мы свяжемся с вами в течение 15 минут",
            timestamp=timestamp.isoformat()
        )
        
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        # Return error detail for debugging
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/contact/health")
async def contact_health():
    """Health check for contact service."""
    try:
        # Check database connection
        db_health = await db_manager.health_check()
        
        # Check Telegram configuration
        telegram_configured = bool(settings.telegram_bot_token and settings.telegram_chat_id)
        
        # Test Telegram connection if configured
        telegram_status = "not_configured"
        if telegram_configured:
            try:
                notifier = TelegramNotifier()
                if await notifier.test_connection():
                    telegram_status = "connected"
                else:
                    telegram_status = "connection_failed"
            except Exception as e:
                logger.error(f"Telegram health check failed: {e}")
                telegram_status = "error"
        
        return {
            "status": "healthy" if db_health["status"] == "healthy" else "degraded",
            "database": db_health,
            "telegram": {
                "configured": telegram_configured,
                "status": telegram_status
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Contact health check failed: {e}")
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
