# 🎯 План действий по результатам аудита

**Дата:** 01 декабря 2025  
**Проект:** NeuroExpert v3.0.0  
**Общая оценка:** 7.8/10

---

## 🔥 Критические действия (СДЕЛАТЬ СЕГОДНЯ)

### 1. Создать .env файл

```bash
# В корне проекта websaitNeuroExpert-master
cp env.example .env
```

Затем заполнить реальными значениями:

```env
MONGODB_URL=mongodb+srv://...
DB_NAME=neuroexpert_db
EMERGENT_LLM_KEY=your_key
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
CLIENT_ORIGIN_URL=https://your-domain.vercel.app
ENVIRONMENT=production
```

### 2. Исправить CORS в backend/main.py

```python
# БЫЛО:
allow_origins=["*"]

# ДОЛЖНО БЫТЬ:
allowed_origins = [
    "https://your-domain.vercel.app",
    "https://neuroexpert.ru"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Только конкретные домены
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### 3. Исправить уязвимости npm

```bash
cd frontend
npm audit fix
```

### 4. Добавить Rate Limiting

```bash
# Установить slowapi
pip install slowapi

# В backend/main.py добавить:
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# В routes/chat.py:
@router.post("/chat")
@limiter.limit("10/minute")  # 10 запросов в минуту
async def chat(request: ChatRequest, http_request: Request):
    ...

# В routes/contact.py:
@router.post("/contact")
@limiter.limit("5/minute")  # 5 запросов в минуту
async def contact_form(request: ContactRequest):
    ...
```

### 5. Унифицировать API Entry Point

**Проблема:** Есть два файла:

- `api/index.py` - минимальная заглушка
- `backend/main.py` - полное приложение

**Решение:** Обновить `api/index.py`:

```python
"""Vercel serverless function entry point."""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import the main app
from main import app

# Vercel will use this app
```

---

## ⚠️ Высокий приоритет (НА ЭТОЙ НЕДЕЛЕ)

### 6. Настроить Sentry для мониторинга ошибок

```bash
# Frontend
npm install --save @sentry/react

# Backend
pip install sentry-sdk[fastapi]
```

**Frontend (src/main.jsx):**

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

**Backend (backend/main.py):**

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)
```

### 7. Улучшить CSP (убрать unsafe-inline)

**vercel.json:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://mc.yandex.ru https://mc.yandex.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; media-src 'self' https://res.cloudinary.com; connect-src 'self' https://mc.yandex.ru https://mc.yandex.com; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

**Затем переместить все inline styles в CSS файлы.**

### 8. Добавить базовые тесты

**Backend (tests/test_chat.py):**

```python
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["healthy", "degraded"]

def test_chat_endpoint():
    response = client.post("/api/chat", json={
        "session_id": "test_session",
        "message": "Привет",
        "model": "gpt-4o"
    })
    assert response.status_code == 200
    assert "response" in response.json()

def test_contact_endpoint():
    response = client.post("/api/contact", json={
        "name": "Тест",
        "contact": "test@example.com",
        "service": "Аудит",
        "message": "Тестовое сообщение"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True
```

**Запуск:**

```bash
pip install pytest pytest-asyncio
pytest tests/
```

### 9. Оптимизировать Bundle Size

**vite.config.mjs:**

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "radix-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-toast",
            "@radix-ui/react-accordion",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 10. Создать индексы MongoDB

**backend/utils/database.py:**

```python
async def create_indexes(self):
    """Create database indexes for performance."""
    if not self.db:
        return

    # Chat messages collection
    await self.db.chat_messages.create_index([
        ("session_id", 1),
        ("timestamp", -1)
    ])

    # Contact forms collection
    await self.db.contact_forms.create_index([
        ("timestamp", -1)
    ])

    logger.info("Database indexes created")
```

Вызвать в `lifespan` функции:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting NeuroExpert backend...")
    db_connected = await db_manager.connect()
    if db_connected:
        await db_manager.create_indexes()  # Создать индексы
    yield
    await db_manager.disconnect()
```

---

## 📊 Средний приоритет (СЛЕДУЮЩАЯ НЕДЕЛЯ)

### 11. Добавить кэширование с Redis

### 12. Настроить CI/CD с GitHub Actions

### 13. Добавить E2E тесты с Playwright

### 14. Оптимизировать изображения (WebP/AVIF)

### 15. Добавить аутентификацию пользователей

---

## ✅ Чеклист выполнения

### Критические (сегодня):

- [ ] Создать .env файл
- [ ] Исправить CORS
- [ ] Исправить npm уязвимости
- [ ] Добавить rate limiting
- [ ] Унифицировать API entry point

### Высокий приоритет (эта неделя):

- [ ] Настроить Sentry
- [ ] Улучшить CSP
- [ ] Добавить базовые тесты
- [ ] Оптимизировать bundle
- [ ] Создать индексы MongoDB

### Средний приоритет (следующая неделя):

- [ ] Добавить Redis кэширование
- [ ] Настроить CI/CD
- [ ] E2E тесты
- [ ] Оптимизация изображений
- [ ] Аутентификация

---

## 📈 Ожидаемые результаты

После выполнения критических и высокоприоритетных задач:

- **Безопасность:** 6.5/10 → 8.5/10
- **Производительность:** 7/10 → 8.5/10
- **Тестирование:** 4/10 → 7/10
- **Мониторинг:** 5/10 → 8/10
- **Общая оценка:** 7.8/10 → 8.5/10

---

## 🚀 Быстрый старт

```bash
# 1. Создать .env
cp env.example .env
# Заполнить реальными значениями

# 2. Установить зависимости
cd frontend && npm install && cd ..
cd backend && pip install -r requirements.txt && cd ..

# 3. Исправить уязвимости
cd frontend && npm audit fix && cd ..

# 4. Запустить локально
# Terminal 1: Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev

# 5. Запустить тесты
cd backend && pytest tests/
cd frontend && npm test
```

---

**Вопросы?** Обратитесь к полному отчету: `COMPREHENSIVE_AUDIT_REPORT.md`
