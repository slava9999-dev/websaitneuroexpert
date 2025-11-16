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

describe('AIChat Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders AI chat component', () => {
    render(<AIChat />);
    
    expect(screen.getByText(/AI консультант/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Задайте вопрос/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('displays initial message', () => {
    render(<AIChat />);
    
    expect(screen.getByText(/Привет! Я AI‑консультант NeuroExpert/i)).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Задайте вопрос/i);
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

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Задайте вопрос/i);
    const button = screen.getByRole('button');
    
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

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Задайте вопрос/i);
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Извините, произошла ошибка/i)).toBeInTheDocument();
    });
  });
});
