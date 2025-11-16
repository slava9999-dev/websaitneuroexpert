# 🔒 Рекомендации по безопасности

## Критические улучшения

### 1. Обновление зависимостей
```bash
npm audit fix --force
npm update
```

### 2. Добавить rate limiting
```javascript
// В API функциях
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов
};
```

### 3. Валидация входных данных
```javascript
// Добавить в contact.js
const validator = require('validator');

if (!validator.isEmail(contact)) {
  return res.status(400).json({ error: "Invalid email" });
}
```

### 4. CSP заголовки
```javascript
// В vercel.json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
      }
    ]
  }
]
```

### 5. Environment validation
```javascript
// Добавить проверку обязательных переменных
const requiredEnvs = ['GOOGLE_API_KEY', 'TELEGRAM_BOT_TOKEN'];
requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});
```
