"""Application settings and environment configuration."""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    # Database
    mongodb_url: str = ""
    db_name: str = "neuroexpert_db"

    # AI Integration
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    google_api_key: Optional[str] = None
    emergent_llm_key: Optional[str] = None

    # Telegram
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None

    # Sentry (Optional, for error monitoring)
    sentry_dsn: Optional[str] = None

    # Frontend/CORS
    client_origin_url: str = "http://localhost:3000"
    environment: str = "development"

    # Logging
    log_level: str = "INFO"

    # AI Chat settings
    max_context_tokens: int = 3000
    max_history_messages: int = 20
    chat_timeout_seconds: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
