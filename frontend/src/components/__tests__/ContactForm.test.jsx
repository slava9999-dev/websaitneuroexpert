import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios;

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

describe('ContactForm Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  test('renders contact form', () => {
    render(<ContactForm />);
    
    expect(screen.getByText(/Свяжитесь с нами/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ваше имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Контакт/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Услуга/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отправить заявку/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /Отправить заявку/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Имя обязательно/i)).toBeInTheDocument();
      expect(screen.getByText(/Контакт обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/Выберите услугу/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Спасибо! Мы свяжемся с вами в течение 15 минут' }
    });

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText(/Ваше имя/i), {
      target: { value: 'Тест Пользователь' }
    });
    fireEvent.change(screen.getByLabelText(/Контакт/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Услуга/i), {
      target: { value: 'Цифровой аудит' }
    });
    fireEvent.change(screen.getByLabelText(/Сообщение/i), {
      target: { value: 'Тестовое сообщение' }
    });
    
    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /Отправить заявку/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          name: 'Тест Пользователь',
          contact: 'test@example.com',
          service: 'Цифровой аудит',
          message: 'Тестовое сообщение'
        })
      );
    });
  });

  test('handles form submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByLabelText(/Ваше имя/i), {
      target: { value: 'Тест Пользователь' }
    });
    fireEvent.change(screen.getByLabelText(/Контакт/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Услуга/i), {
      target: { value: 'Цифровой аудит' }
    });
    
    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /Отправить заявку/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
