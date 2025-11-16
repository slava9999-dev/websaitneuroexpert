import { createMocks } from 'node-mocks-http';
import handler from '../contact.js';

// Mock fetch
global.fetch = jest.fn();

describe('/api/contact endpoint', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat-id';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  test('handles OPTIONS request', async () => {
    const { req, res } = createMocks({
      method: 'OPTIONS',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['access-control-allow-origin']).toBe('*');
    expect(res._getHeaders()['access-control-allow-methods']).toBe('POST,OPTIONS');
  });

  test('rejects non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method Not Allowed'
    });
  });

  test('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'Тест' } // missing contact and service
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Missing required fields'
    });
  });

  test('handles missing environment variables', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Тест Пользователь',
        contact: 'test@example.com',
        service: 'Цифровой аудит'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Server not configured for Telegram'
    });
  });

  test('sends telegram message successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, result: { message_id: 123 } })
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Тест Пользователь',
        contact: 'test@example.com',
        service: 'Цифровой аудит',
        message: 'Тестовое сообщение'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      message: 'Спасибо! Мы свяжемся с вами в течение 15 минут'
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.telegram.org/bottest-bot-token/sendMessage',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Тест Пользователь')
      })
    );
  });

  test('handles telegram API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false, error_code: 400, description: 'Bad Request' })
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Тест Пользователь',
        contact: 'test@example.com',
        service: 'Цифровой аудит'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(502);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to send Telegram notification',
      details: { ok: false, error_code: 400, description: 'Bad Request' }
    });
  });

  test('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Тест Пользователь',
        contact: 'test@example.com',
        service: 'Цифровой аудит'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error'
    });
  });
});
