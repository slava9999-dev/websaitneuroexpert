import { createMocks } from 'node-mocks-http';
import handler from '../chat.js';

// Mock fetch
global.fetch = jest.fn();

describe('/api/gemini endpoint', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.GOOGLE_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_API_KEY;
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

  test('returns response for valid POST request', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: 'Тестовый ответ от Gemini' }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: 'Тестовый вопрос' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  test('handles missing API key', async () => {
    delete process.env.GOOGLE_API_KEY;

    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: 'Тестовый вопрос' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Google API key not configured'
    });
  });

  test('handles API error', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: { prompt: 'Тестовый вопрос' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to get AI response'
    });
  });

  test('uses default prompt when none provided', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: 'Привет! Я AI‑консультант NeuroExpert' }]
        }
      }]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {}
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('Привет! Я AI‑консультант NeuroExpert')
      })
    );
  });
});
