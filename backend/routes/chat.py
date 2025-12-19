"""Chat API routes with AI integration and context management."""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from memory.smart_context import SmartContext
from utils.ai_clients import get_ai_client, AIClientError
from utils.database import db_manager
from config.settings import settings

logger = logging.getLogger(__name__)

# Initialize rate limiter for this router
limiter = Limiter(key_func=get_remote_address)

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
    """Provide fallback response for errors - maintains sales-oriented tone."""
    fallbacks = [
        "Привет! 👋 Я AI-консультант NeuroExpert. Помогаю бизнесу расти с помощью технологий — сайты, AI-ассистенты, цифровой аудит. Расскажите о вашей задаче?",
        "Рад помочь! 🚀 Мы в NeuroExpert создаём digital-решения для бизнеса. Какая задача перед вами — нужен сайт, автоматизация или что-то ещё?",
        "Добро пожаловать! ✨ Я помогу подобрать решение для вашего бизнеса. Что вас интересует — разработка, дизайн или AI-решения?",
    ]
    
    # For completely irrelevant questions - soft redirect
    irrelevant_keywords = ["погода", "новости", "спорт", "фильмы", "музыка", "политика"]
    if any(keyword in message.lower() for keyword in irrelevant_keywords):
        return "Интересный вопрос! 😊 Но я больше специализируюсь на digital-решениях для бизнеса. Могу рассказать, как сайт или AI-ассистент поможет вашему делу. Хотите узнать подробнее?"
    
    return fallbacks[hash(message) % len(fallbacks)]


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, body: ChatRequest):
    """Handle chat requests with AI integration and context management.
    
    Rate limit: 10 requests per minute per IP address.
    """
    start_time = datetime.utcnow()
    
    try:
        # Validate session ID
        if not body.session_id:
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
                history = await smart_context.get_context(body.session_id)
        except Exception as e:
            logger.error(f"Failed to load context: {e}")
            history = []
        
        # Build messages for AI
        messages = []
        
        # Add system message - comprehensive sales-oriented prompt
        system_prompt = """Ты — AI-консультант NeuroExpert, эксперт по digital-трансформации для бизнеса.

## 🏢 О КОМПАНИИ
NeuroExpert — молодое digital-агентство с фокусом на качество:
- 10+ успешных кейсов
- Индивидуальный подход к каждому проекту
- Работаем с малым и средним бизнесом
- Честные сроки и прозрачное ценообразование

## 🎯 НАШИ УСЛУГИ

### 1. Разработка сайтов
- Лендинги (от 50 000 ₽, 2-3 недели)
- Корпоративные сайты (от 150 000 ₽)
- Интернет-магазины (от 250 000 ₽)
- Веб-приложения под ключ

### 2. AI-ассистенты и чат-боты  
- Умные консультанты для сайта (от 80 000 ₽)
- Telegram/WhatsApp боты
- Автоматизация поддержки клиентов
- Интеграция с CRM

### 3. Цифровой аудит
- Анализ сайта и конкурентов (от 30 000 ₽)
- SEO-аудит с рекомендациями
- UX/UI анализ
- Аудит безопасности

### 4. Дизайн
- Фирменный стиль (от 70 000 ₽)
- UI/UX дизайн интерфейсов
- Рекламные креативы
- Презентации

### 5. Техподдержка
- Абонентское обслуживание сайтов (от 15 000 ₽/мес)
- Доработки и обновления
- Мониторинг и защита

## 💬 СТИЛЬ ОБЩЕНИЯ
1. Говори дружелюбно, но профессионально
2. Используй эмодзи умеренно для акцентов
3. Структурируй ответы списками
4. Давай конкретные примеры
5. Всегда завершай призывом к действию

## 🎯 ТВОЯ ЦЕЛЬ
Помочь клиенту понять, какая услуга решит его задачу, и пригласить оставить заявку.

## 📞 ПРИЗЫВЫ К ДЕЙСТВИЮ
Используй в конце ответов:
- "Оставьте контакт в форме ниже — свяжемся за 15 минут!"
- "Хотите обсудить ваш проект? Напишите нам!"
- "Готовы рассчитать стоимость — просто опишите задачу"

## ⚡ ОБРАБОТКА ВОПРОСОВ НЕ ПО ТЕМЕ
Если вопрос не связан с digital-услугами:
- НЕ отказывай жёстко
- Кратко ответь (1-2 предложения) 
- Плавно переведи к нашим услугам
Пример: "Интересный вопрос! Кстати, мы в NeuroExpert как раз используем AI для создания умных ассистентов. Хотите узнать, как это может помочь вашему бизнесу?"

## ❌ ЗАПРЕЩЕНО
- Называть точные сроки без уточнения задачи
- Обещать невозможное
- Критиковать конкурентов
- Обсуждать политику, религию, личные темы

## ✅ ВАЖНО
- Всегда спрашивай о бизнесе клиента
- Предлагай бесплатную консультацию
- Упоминай гарантию результата"""
        messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history
        for turn in history:
            messages.append({"role": "user", "content": turn["user"]})
            messages.append({"role": "assistant", "content": turn["assistant"]})
        
        # Add current message
        messages.append({"role": "user", "content": body.message})
        
        # Generate AI response
        ai_response = None
        try:
            # Use GPT-4o-mini for optimal cost/performance balance
            model = "gpt-4o-mini"
            client = get_ai_client(model)
            ai_response = await client.generate(messages, model)
            logger.info(f"Generated response using {model}")
        except AIClientError as e:
            logger.error(f"AI generation failed: {e}")
            ai_response = get_fallback_response(body.message)
        except Exception as e:
            logger.error(f"Unexpected AI error: {e}")
            ai_response = get_fallback_response(body.message)
        
        # Save conversation to database
        try:
            await smart_context.save_message(body.session_id, body.message, ai_response)
        except Exception as e:
            logger.error(f"Failed to save conversation: {e}")
            # Continue even if save fails
        
        # Return response
        response = ChatResponse(
            response=ai_response,
            session_id=body.session_id,
            model="gpt-4o-mini",
            timestamp=start_time.isoformat()
        )
        
        logger.info(f"Chat processed for session {body.session_id}")
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
        for model in ["gpt-4o-mini"]:
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
