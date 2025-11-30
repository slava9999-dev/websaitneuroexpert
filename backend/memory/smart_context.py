"""Smart context manager for AI chat with MongoDB persistence."""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from motor.motor_asyncio import AsyncIOMotorClient
from tiktoken import get_encoding
from config.settings import settings

logger = logging.getLogger(__name__)


class SmartContext:
    """Manages conversation context with token counting and MongoDB storage."""

    def __init__(self, db_client: AsyncIOMotorClient):
        """Initialize with MongoDB client."""
        self.db = db_client[settings.db_name]
        self.chat_collection = self.db.chat_messages
        self.encoding = get_encoding("cl100k_base")  # GPT-4 tokenizer, works for most models

    async def save_message(self, session_id: str, user_message: str, ai_response: str) -> bool:
        """Save a conversation turn to MongoDB."""
        try:
            document = {
                "session_id": session_id,
                "user_message": user_message,
                "ai_response": ai_response,
                "timestamp": datetime.utcnow(),
                "tokens_user": self._count_tokens(user_message),
                "tokens_ai": self._count_tokens(ai_response),
            }
            await self.chat_collection.insert_one(document)
            logger.info(f"Saved message for session {session_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to save message: {e}")
            return False

    async def get_context(self, session_id: str) -> List[Dict[str, str]]:
        """Load conversation history, respecting token limits."""
        try:
            # Get recent messages in descending order
            cursor = self.chat_collection.find(
                {"session_id": session_id}
            ).sort("timestamp", -1).limit(settings.max_history_messages)
            
            messages = []
            total_tokens = 0
            
            async for doc in cursor:
                message_tokens = doc["tokens_user"] + doc["tokens_ai"]
                if total_tokens + message_tokens > settings.max_context_tokens:
                    break
                
                # Add in chronological order (oldest first)
                messages.insert(0, {
                    "user": doc["user_message"],
                    "assistant": doc["ai_response"]
                })
                total_tokens += message_tokens
            
            logger.info(f"Loaded {len(messages)} messages for session {session_id} ({total_tokens} tokens)")
            return messages
            
        except Exception as e:
            logger.error(f"Failed to load context: {e}")
            return []

    def _count_tokens(self, text: str) -> int:
        """Count tokens in text using tiktoken."""
        try:
            return len(self.encoding.encode(text))
        except Exception:
            # Fallback: rough estimation (1 token ≈ 4 chars)
            return len(text) // 4

    async def cleanup_old_messages(self, days: int = 30) -> int:
        """Remove messages older than specified days."""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            result = await self.chat_collection.delete_many({
                "timestamp": {"$lt": cutoff_date}
            })
            logger.info(f"Cleaned up {result.deleted_count} old messages")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Failed to cleanup old messages: {e}")
            return 0
