# 🧪 Стратегия тестирования

## Unit тесты

### 1. Компоненты
```javascript
// src/components/__tests__/AIChat.test.jsx
import { render, screen } from '@testing-library/react';
import AIChat from '../AIChat';

test('renders AI chat component', () => {
  render(<AIChat />);
  expect(screen.getByText(/AI консультант/i)).toBeInTheDocument();
});
```

### 2. API функции
```javascript
// api/__tests__/chat.test.js
import handler from '../chat';
import { createMocks } from 'node-mocks-http';

test('/api/gemini returns response', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { prompt: 'Hello' }
  });
  
  await handler(req, res);
  expect(res._getStatusCode()).toBe(200);
});
```

## Integration тесты

### 1. API endpoints
```javascript
// tests/integration/api.test.js
describe('API Integration', () => {
  test('POST /api/contact sends telegram message', async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        contact: 'test@example.com',
        service: 'Аудит'
      })
    });
    
    expect(response.status).toBe(200);
  });
});
```

## E2E тесты

### 1. Playwright setup
```javascript
// tests/e2e/contact-form.spec.js
import { test, expect } from '@playwright/test';

test('contact form submission', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="contact"]', 'test@example.com');
  await page.selectOption('[name="service"]', 'Аудит');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.toast')).toContainText('Спасибо');
});
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```
