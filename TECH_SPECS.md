# 📋 ТЕХНИЧЕСКИЙ ПАСПОРТ - NeuroExpert

## 🎯 О ПРОЕКТЕ

**Название:** NeuroExpert  
**Версия:** 3.0.0  
**Тип:** AI-платформа для цифровой трансформации бизнеса  
**Описание:** Landing page с интерактивным AI-консультантом на базе Google Gemini для продажи digital-услуг (аудит, AI-ассистенты, разработка сайтов, техподдержка)

---

## 🛠 ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Frontend

- **Framework:** React 18.3.1
- **Сборщик:** Vite 5.4.0
- **Стилизация:** Tailwind CSS 3.4.15
- **UI библиотека:** Radix UI (20+ компонентов)
- **Анимации:** Framer Motion 11.12.0
- **HTTP клиент:** Axios 1.7.7
- **Формы:** React Hook Form 7.54.0 + Zod 3.23.8
- **Уведомления:** Sonner 2.0.7
- **Иконки:** Lucide React 0.462.0
- **TypeScript:** 5.6.3 (поддержка)

### Backend

- **Framework:** FastAPI (Python)
- **База данных:** MongoDB Atlas
- **ORM/Driver:** Motor 3.3.0+ (async MongoDB driver)
- **Валидация:** Pydantic 2.0+
- **Конфигурация:** Pydantic Settings 2.0+
- **HTTP клиент:** HTTPX 0.24.0+ (async)
- **AI токены:** Tiktoken 0.5.0+

### AI & Интеграции

- **AI модель:** Google Gemini (GPT-4o, Claude Sonnet)
- **AI API:** Emergent LLM API
- **Уведомления:** Telegram Bot API
- **Аналитика:** Яндекс.Метрика (ID: 105459977)
- **Мониторинг:** Vercel Analytics + Speed Insights

### Hosting & Infrastructure

- **Платформа:** Vercel Serverless Functions
- **CDN:** Vercel Edge Network
- **Медиа:** Cloudinary (видео оптимизация)
- **DNS:** Vercel DNS

---

## 📊 ХАРАКТЕРИСТИКИ ПРОЕКТА

### Размеры и метрики

- **Production build:** 6.35 MB (10 файлов)
- **Компоненты:** 64+ React компонентов
- **Production зависимости:** 43 пакета
- **Dev зависимости:** 18 пакетов
- **Backend зависимости:** 9 Python пакетов
- **Строк кода (оценка):** ~15,000+ строк

### Производительность

- **Сборка:** Vite (быстрая HMR)
- **Bundle splitting:** Базовый (можно улучшить)
- **Lazy loading:** Частичный
- **Кэширование:** Vercel CDN
- **Оптимизация изображений:** WebP формат
- **Видео:** Cloudinary оптимизация

### Безопасность

- **HTTPS:** Enforced (HSTS)
- **CSP:** Настроен (с unsafe-inline)
- **CORS:** Настроен
- **Security Headers:** X-Frame-Options, X-Content-Type-Options
- **Input Validation:** Pydantic + Zod
- **Rate Limiting:** Отсутствует ⚠️

---

## 🏗 АРХИТЕКТУРА

### Структура приложения

```
SPA (Single Page Application)
├── Hero Section (видео фон)
├── Service Cards (4 услуги)
├── Portfolio (кейсы)
├── Advantages (преимущества)
├── Team (команда)
├── Contact Form (форма заявки)
└── AI Chat Widget (плавающий)
```

### API Endpoints

```
GET  /api/health          # Health check
POST /api/chat            # AI консультант
POST /api/contact         # Форма обратной связи
GET  /api/chat/health     # Chat service health
GET  /api/contact/health  # Contact service health
```

### База данных (MongoDB)

```
Collections:
├── chat_messages         # История AI чата
└── contact_forms         # Заявки клиентов
```

### Навигация

- **Тип:** Single Page (без роутинга)
- **Метод:** Якорные ссылки (#portfolio, #team)
- **Прокрутка:** Smooth scroll

---

## 🎨 UI/UX ОСОБЕННОСТИ

### Дизайн система

- **Цветовая схема:** Темная тема (#0b0f17)
- **Акценты:** Индиго (#6366F1) + Фиолетовый (#8B5CF6)
- **Шрифт:** Inter (Google Fonts)
- **Радиусы:** Настраиваемые CSS переменные
- **Анимации:** Framer Motion + Tailwind Animate

### Компоненты

- **Header:** Адаптивное меню
- **Hero:** Видео фон + CTA
- **Service Cards:** 4 карточки услуг
- **Portfolio:** Галерея проектов
- **Team:** 3D flip карточки
- **AI Chat:** Floating widget с памятью
- **Contact Form:** Валидация + Telegram уведомления

### Адаптивность

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Breakpoints:** Tailwind стандартные

---

## 🔌 ИНТЕГРАЦИИ

### AI Chat

- **Модели:** GPT-4o, Claude Sonnet
- **Память:** До 20 сообщений / 3000 токенов
- **Session:** localStorage (persistent)
- **Retry:** Экспоненциальный backoff
- **Timeout:** 30 секунд

### Telegram

- **Уведомления:** Новые заявки
- **Формат:** Markdown
- **Статус:** Опциональный (можно отключить)

### Яндекс.Метрика

- **ID:** 105459977
- **Функции:** Webvisor, Clickmap, Ecommerce
- **Цели:** AI_CHAT_OPEN, AI_CHAT_MESSAGE_SENT, CONTACT_FORM_SUBMIT

### Vercel Analytics

- **Web Vitals:** Автоматический сбор
- **Speed Insights:** Включен
- **Real User Monitoring:** Да

---

## 📦 ЗАВИСИМОСТИ

### Frontend (ключевые)

```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "vite": "5.4.0",
  "tailwindcss": "3.4.15",
  "framer-motion": "11.12.0",
  "axios": "1.7.7",
  "@radix-ui/*": "20+ пакетов",
  "react-hook-form": "7.54.0",
  "zod": "3.23.8",
  "lucide-react": "0.462.0"
}
```

### Backend (все)

```txt
fastapi >= 0.100.0
uvicorn >= 0.23.0
motor >= 3.3.0
pydantic >= 2.0.0
pydantic-settings >= 2.0.0
python-dotenv >= 1.0.0
httpx >= 0.24.0
tiktoken >= 0.5.0
dnspython >= 2.4.0
```

---

## 🔧 КОНФИГУРАЦИЯ

### Environment Variables (требуются)

```bash
# Database
MONGODB_URL=mongodb+srv://...
DB_NAME=neuroexpert_db

# AI
EMERGENT_LLM_KEY=your_key

# Telegram (опционально)
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

# CORS
CLIENT_ORIGIN_URL=https://neuroexpert.ru
ENVIRONMENT=production
```

### Build Commands

```bash
# Development
npm run dev              # Frontend dev server
uvicorn main:app --reload  # Backend dev server

# Production
npm run build            # Build frontend
vercel --prod           # Deploy to Vercel
```

### Scripts (package.json)

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
  "type-check": "tsc --noEmit"
}
```

---

## 📱 SEO & META

### Основные теги

- **Title:** "NeuroExpert — Цифровые решения с ИИ | AI-автоматизация бизнеса"
- **Description:** "Цифровой аудит, AI-ассистенты 24/7, сайты под ключ и техподдержка. Быстрый результат за 10-14 дней. Гарантия ROI."
- **Keywords:** цифровой аудит, AI ассистент, чат-бот, разработка сайтов
- **Language:** ru
- **Canonical:** https://neuroexpert.ru

### Open Graph

- **Type:** website
- **Image:** Cinematic tech cover
- **URL:** https://neuroexpert.ru

### Structured Data

- **Type:** Organization (JSON-LD)
- **Schema.org:** Полная разметка

### Performance Optimizations

- **Preconnect:** Google Fonts, Cloudinary
- **Async Scripts:** Yandex.Metrika
- **Font Display:** swap

---

## 🌐 DEPLOYMENT

### Платформа

- **Provider:** Vercel
- **Region:** Auto (Edge Network)
- **Serverless:** Python Functions
- **Build:** Automatic (Git push)

### Конфигурация (vercel.json)

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [{ "source": "/api/:path*", "destination": "/api/index.py" }]
}
```

### Security Headers

- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

---

## 📈 ТЕКУЩИЙ СТАТУС

### Что работает ✅

- AI-консультант с памятью диалога
- Форма обратной связи + Telegram уведомления
- Адаптивный дизайн (mobile/tablet/desktop)
- Видео фон с оптимизацией
- Яндекс.Метрика аналитика
- MongoDB хранение данных
- Vercel деплой

### Технические характеристики

- **Uptime:** Зависит от Vercel (99.9%+)
- **Response Time:** < 500ms (API)
- **AI Response:** 2-5 секунд
- **Page Load:** ~2-3 секунды (первая загрузка)
- **Bundle Size:** 6.35 MB (можно оптимизировать)

---

## 📊 МЕТРИКИ КАЧЕСТВА

### Code Quality

- **ESLint:** Настроен
- **TypeScript:** Частичная поддержка
- **Prettier:** Не настроен
- **Test Coverage:** ~5%

### Browser Support

- **Chrome:** ✅ Latest
- **Firefox:** ✅ Latest
- **Safari:** ✅ Latest
- **Edge:** ✅ Latest
- **Mobile Safari:** ✅
- **Mobile Chrome:** ✅

### Accessibility

- **ARIA labels:** Частично
- **Keyboard navigation:** Базовая
- **Screen readers:** Не тестировалось
- **WCAG:** Не проверялось

---

## 🔗 ПОЛЕЗНЫЕ ССЫЛКИ

### Документация проекта

- `README.md` - Общее описание
- `DEPLOY.md` - Инструкция по деплою
- `AI_CHAT_HEALTH.md` - Отладка AI чата
- `DEVOPS.md` - DevOps практики
- `COMPREHENSIVE_AUDIT_REPORT.md` - Полный аудит
- `AUDIT_ACTION_PLAN.md` - План улучшений

### Внешние ресурсы

- **Production:** https://neuroexpert.ru
- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Telegram Bot:** @BotFather

---

**Дата создания паспорта:** 02.12.2025  
**Версия документа:** 1.0  
**Статус проекта:** Production Ready (с рекомендациями по улучшению)
