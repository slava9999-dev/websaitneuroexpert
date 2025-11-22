import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChat from '../AIChat';

// Mock fetch
global.fetch = jest.fn();

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock scrollIntoView for jsdom
beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  }
});

const renderAndOpenChat = () => {
  render(<AIChat />);
  fireEvent.click(screen.getByRole('button', { name: /💬/i }));
};

const waitForChatReady = async () => {
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/Напишите сообщение/i)).not.toBeDisabled();
  });
};

describe('AIChat Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders AI chat component', async () => {
    renderAndOpenChat();
    await waitForChatReady();
    
    await screen.findByText(/AI.?консультант/i);
    expect(screen.getByPlaceholderText(/Напишите сообщение/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отправить сообщение/i })).toBeInTheDocument();
  });

  test('displays initial message', () => {
    render(<AIChat />);
    fireEvent.click(screen.getByRole('button', { name: /💬/i }));
    
    expect(screen.getByText(/Привет! Я AI‑консультант NeuroExpert/i)).toBeInTheDocument();
  });

  test('handles user input', async () => {
    renderAndOpenChat();
    await waitForChatReady();
    
    const input = screen.getByPlaceholderText(/Напишите сообщение/i);
    fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });
    
    expect(input.value).toBe('Тестовый вопрос');
  });

  test('sends message on form submit', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Тестовый ответ от AI' }]
          }
        }]
      })
    });

    renderAndOpenChat();
    await waitForChatReady();
    
    const input = screen.getByPlaceholderText(/Напишите сообщение/i);
    const button = screen.getByRole('button', { name: /Отправить сообщение/i });
    
    fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/gemini'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Тестовый вопрос')
        })
      );
    });
  });

  test('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    renderAndOpenChat();
    await waitForChatReady();
    
    const input = screen.getByPlaceholderText(/Напишите сообщение/i);
    const button = screen.getByRole('button', { name: /Отправить сообщение/i });
    
    fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });
    fireEvent.click(button);
    
    await screen.findByText(/Извините, возникла ошибка\. Пожалуйста, попробуйте снова или напишите нам напрямую\./i);
  });
});
