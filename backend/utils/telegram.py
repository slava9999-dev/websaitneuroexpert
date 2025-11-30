"""Telegram notification utilities."""

import asyncio
import httpx
import logging
from typing import Optional
from config.settings import settings

logger = logging.getLogger(__name__)


class TelegramNotifier:
    """Handles Telegram notifications for contact forms."""

    def __init__(self):
        self.bot_token = settings.telegram_bot_token
        self.chat_id = settings.telegram_chat_id
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

    async def send_contact_notification(self, name: str, contact: str, service: str, message: Optional[str] = None) -> bool:
        """Send notification about new contact form submission."""
        if not self.bot_token or not self.chat_id:
            logger.warning("Telegram not configured - skipping notification")
            return False
        
        text = (
            f"✨ Новая заявка NeuroExpert\n\n"
            f"👤 Имя: {name}\n"
            f"📞 Контакт: {contact}\n"
            f"💼 Услуга: {service}\n"
            f"💬 Сообщение: {message or '—'}"
        )
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.base_url}/sendMessage",
                    json={"chat_id": self.chat_id, "text": text, "parse_mode": "HTML"}
                )
                response.raise_for_status()
                logger.info("Telegram notification sent successfully")
                return True
        except Exception as e:
            logger.error(f"Failed to send Telegram notification: {e}")
            return False

    async def test_connection(self) -> bool:
        """Test Telegram bot connection."""
        if not self.bot_token:
            return False
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/getMe")
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Telegram connection test failed: {e}")
            return False
