"""Database connection and utilities."""

import asyncio
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Manages MongoDB connection and basic operations."""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None

    async def connect(self) -> bool:
        """Establish MongoDB connection."""
        if not settings.mongodb_url:
            logger.error("MongoDB URL not configured")
            return False
        
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_url)
            # Test connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.db_name]
            logger.info("MongoDB connected successfully")
            return True
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            return False

    async def disconnect(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    def get_database(self):
        """Get database instance."""
        if not self.db:
            raise RuntimeError("Database not connected")
        return self.db

    async def save_contact_form(self, name: str, contact: str, service: str, message: str) -> bool:
        """Save contact form submission."""
        if not self.db:
            logger.error("Database not connected")
            return False
        
        try:
            document = {
                "name": name,
                "contact": contact,
                "service": service,
                "message": message,
                "timestamp": asyncio.get_event_loop().time(),
                "status": "new"
            }
            await self.db.contact_forms.insert_one(document)
            logger.info(f"Saved contact form from {name}")
            return True
        except Exception as e:
            logger.error(f"Failed to save contact form: {e}")
            return False

    async def health_check(self) -> dict:
        """Perform database health check."""
        try:
            if not self.client:
                return {"status": "error", "message": "Database not connected"}
            
            await self.client.admin.command('ping')
            collections = await self.db.list_collection_names().to_list(None)
            
            return {
                "status": "healthy",
                "database": settings.db_name,
                "collections": collections,
                "connection": "ok"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "database": settings.db_name,
                "connection": "failed"
            }


# Global database instance
db_manager = DatabaseManager()
