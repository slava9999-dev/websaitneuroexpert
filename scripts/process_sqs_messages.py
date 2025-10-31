#!/usr/bin/env python3
import os
import json
import asyncio
from dotenv import load_dotenv
import boto3
import aiohttp
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Инициализация клиентов
sqs = boto3.client(
    'sqs',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

async def process_message(msg):
    body = json.loads(msg['Body'])
    if body.get('type') == 'telegram':
        await send_telegram(body['payload'])
    # TODO: добавить другие типы сообщений
    # удаляем сообщение из очереди после обработки
    sqs.delete_message(QueueUrl=SQS_QUEUE_URL, ReceiptHandle=msg['ReceiptHandle'])

async def send_telegram(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    async with aiohttp.ClientSession() as session:
        await session.post(url, json={
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        })

async def poll_queue():
    while True:
        resp = sqs.receive_message(
            QueueUrl=SQS_QUEUE_URL,
            MaxNumberOfMessages=10,
            WaitTimeSeconds=20
        )
        messages = resp.get('Messages', [])
        tasks = [process_message(m) for m in messages]
        if tasks:
            await asyncio.gather(*tasks)
        await asyncio.sleep(1)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(poll_queue())
