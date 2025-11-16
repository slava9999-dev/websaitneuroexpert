# 📊 Мониторинг и аналитика

## Vercel Analytics

### 1. Включить в vercel.json
```json
{
  "analytics": {
    "enable": true
  },
  "speedInsights": {
    "enable": true
  }
}
```

### 2. Web Vitals компонент
```javascript
// src/components/Analytics.jsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function AnalyticsWrapper() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

## Error Monitoring

### Sentry интеграция
```javascript
// src/utils/sentry.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Логирование

### Structured logging
```javascript
// utils/logger.js
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message, error = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

## Business Metrics

### Конверсии
```javascript
// Отслеживание конверсий
const trackConversion = (event, data) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', event, data);
  }
  
  // Yandex Metrika
  if (typeof ym !== 'undefined') {
    ym(104770996, 'reachGoal', event, data);
  }
};
```
