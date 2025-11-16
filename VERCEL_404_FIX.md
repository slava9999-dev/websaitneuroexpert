# 🔧 ИСПРАВЛЕНИЕ 404 ОШИБКИ НА VERCEL

## 🚨 Проблема
Vercel возвращал 404 ошибку из-за неправильной структуры проекта.

## ✅ Исправления

### 1. **Структура проекта**
```
websaitneuroexpert/
├── package.json          # Корневой package.json для Vercel
├── vercel.json           # Упрощенная конфигурация
├── api/                  # API эндпоинты в корне (стандарт Vercel)
│   ├── gemini.js        # /api/gemini эндпоинт
│   └── contact.js       # /api/contact эндпоинт
└── frontend/            # React приложение
    ├── build/           # Статические файлы после сборки
    └── src/             # Исходный код
```

### 2. **Vercel.json конфигурация**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/build",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### 3. **Package.json в корне**
```json
{
  "name": "websaitneuroexpert",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build"
  }
}
```

## 🎯 Результат
- ✅ API эндпоинты доступны по `/api/gemini` и `/api/contact`
- ✅ Статические файлы корректно обслуживаются
- ✅ SPA роутинг работает через fallback на `/index.html`
- ✅ Упрощенная конфигурация без сложных builds

## 🚀 Environment Variables для Vercel
```
GOOGLE_API_KEY=AIzaSy...
TELEGRAM_BOT_TOKEN=1234567890:ABC...
TELEGRAM_CHAT_ID=123456789
```

## 📋 Проверка после деплоя
1. Главная страница: `https://your-domain.vercel.app/`
2. AI чат API: `https://your-domain.vercel.app/api/gemini`
3. Контактная форма: `https://your-domain.vercel.app/api/contact`
