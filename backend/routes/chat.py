"""Chat API routes with AI integration and context management."""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from memory.smart_context import SmartContext
from utils.ai_clients import get_ai_client, AIClientError
from utils.database import db_manager
from config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    session_id: str
    message: str
    model: str = "gpt-4o"


class ChatResponse(BaseModel):
    response: str
    session_id: str
    model: str
    timestamp: str


def get_fallback_response(message: str) -> str:
    """Provide fallback response for irrelevant questions or errors."""
    fallbacks = [
        "Я AI-ассистент NeuroExpert и могу помочь с вопросами о цифровых услугах. Расскажите, что вас интересует?",
        "Я специализирую на digital-трансформации. Могу рассказать об услугах, аудите или разработке. Что именно вас интересует?",
        "Я здесь, чтобы помочь с вопросами о наших услугах. Спросите меня о разработке, дизайне или AI-решениях.",
    ]
    
    # Simple relevance check
    irrelevant_keywords = ["погода", "новости", "спорт", "фильмы", "музыка"]
    if any(keyword in message.lower() for keyword in irrelevant_keywords):
        return "Я специализируюсь на digital-услугах. Могу помочь с вопросами о разработке, дизайне и AI-решениях. Что вас интересует?"
    
    return fallbacks[hash(message) % len(fallbacks)]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, http_request: Request):
    """Handle chat requests with AI integration and context management.
    
    Rate limit: 10 requests per minute per IP address.
    """
    start_time = datetime.utcnow()
    
    try:
        # Validate session ID
        if not request.session_id:
            raise HTTPException(status_code=400, detail="Session ID is required")
        
        # Initialize context manager
        try:
            smart_context = SmartContext(db_manager.client)
        except Exception as e:
            logger.error(f"Failed to initialize SmartContext: {e}")
            raise HTTPException(status_code=503, detail="Context service unavailable")
        
        # Load conversation history
        history = []
        try:
            if db_manager.db:
                history = await smart_context.get_context(request.session_id)
        except Exception as e:
            logger.error(f"Failed to load context: {e}")
            history = []
        
        # Build messages for AI
        messages = []
        
        # Add system message
        system_prompt = (
            "Ты — AI-консультант NeuroExpert, эксперт по digital-трансформации. "
            "Твоя задача — отвечать на вопросы о наших услугах: разработка сайтов, "
            "AI-ассистенты, цифровой аудит, дизайн, техподдержка. Будь вежлив, "
            "конкретен и предлагай решения. Если вопрос нерелевантен, вежливо "
            "верни к теме digital-услуг."
        )
        messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history
        for turn in history:
            messages.append({"role": "user", "content": turn["user"]})
            messages.append({"role": "assistant", "content": turn["assistant"]})
        
        # Add current message
        messages.append({"role": "user", "content": request.message})
        
        # Generate AI response
        ai_response = None
        try:
            # Force GPT-4o usage
            client = get_ai_client("gpt-4o")
            ai_response = await client.generate(messages, "gpt-4o")
            logger.info(f"Generated response using gpt-4o")
        except AIClientError as e:
            logger.error(f"AI generation failed: {e}")
            ai_response = get_fallback_response(request.message)
        except Exception as e:
            logger.error(f"Unexpected AI error: {e}")
            ai_response = get_fallback_response(request.message)
        
        # Save conversation to database
        try:
            await smart_context.save_message(request.session_id, request.message, ai_response)
        except Exception as e:
            logger.error(f"Failed to save conversation: {e}")
            # Continue even if save fails
        
        # Return response
        response = ChatResponse(
            response=ai_response,
            session_id=request.session_id,
            model="gpt-4o",
            timestamp=start_time.isoformat()
        )
        
        logger.info(f"Chat processed for session {request.session_id}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        # Return error detail for debugging (remove in production if needed)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/chat/health")
async def chat_health():
    """Health check for chat service."""
    try:
        # Check database connection
        db_health = await db_manager.health_check()
        
        # Check AI clients configuration
        ai_status = {}
        for model in ["gpt-4o"]:
            try:
                client = get_ai_client(model)
                ai_status[model] = "configured"
            except Exception:
                ai_status[model] = "not_configured"
        
        return {
            "status": "healthy" if db_health["status"] == "healthy" else "degraded",
            "database": db_health,
            "ai_clients": ai_status,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Chat health check failed: {e}")
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
