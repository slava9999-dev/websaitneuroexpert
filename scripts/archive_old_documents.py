#!/usr/bin/env python3
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
# Сколько дней хранить данные (по умолчанию 30)
RETENTION_DAYS = int(os.getenv("RETENTION_DAYS", "30"))

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def archive_collection(collection_name: str, archive_name: str, date_field: str):
    threshold = datetime.utcnow() - timedelta(days=RETENTION_DAYS)
    filter_query = {date_field: {"$lt": threshold}}
    docs = await db[collection_name].find(filter_query).to_list(length=None)
    if not docs:
        print(f"No documents to archive in {collection_name}")
        return
    # Вставляем в архивную коллекцию
    result_insert = await db[archive_name].insert_many(docs)
    # Удаляем из основной коллекции
    ids = [doc.get("_id") for doc in docs]
    result_delete = await db[collection_name].delete_many({"_id": {"$in": ids}})
    print(f"Archived {len(docs)} docs from {collection_name} to {archive_name}. Deleted {result_delete.deleted_count} docs.")

async def main():
    await archive_collection("chat_messages", "chat_messages_archive", "timestamp")
    await archive_collection("contact_forms", "contact_forms_archive", "timestamp")
    client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
