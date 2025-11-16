# ⚡ Рекомендации по производительности

## Bundle оптимизация

### 1. Анализ размера bundle
```bash
npm run analyze
```

### 2. Code splitting
```javascript
// Lazy loading компонентов
const AIChat = lazy(() => import('./components/AIChat'));
const ContactForm = lazy(() => import('./components/ContactForm'));
```

### 3. Оптимизация изображений
```javascript
// Добавить в vercel.json
"images": {
  "domains": ["customer-assets.emergentagent.com"],
  "formats": ["image/webp", "image/avif"]
}
```

### 4. Кэширование
```javascript
// Service Worker для кэширования
const CACHE_NAME = 'neuroexpert-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];
```

### 5. Preloading критических ресурсов
```html
<link rel="preload" href="/api/gemini" as="fetch" crossorigin>
<link rel="preload" href="/background.webm" as="video">
```

## Мониторинг

### Web Vitals
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```
