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
import { toast } from 'sonner';

// Mock Select (Radix) to simple components for testing
jest.mock('../ui/select', () => {
  const React = require('react');
  const SelectContext = React.createContext({ onValueChange: () => {} });

  const Select = ({ onValueChange, children }) => (
    <SelectContext.Provider value={{ onValueChange }}>
      <div>{children}</div>
    </SelectContext.Provider>
  );

  const SelectTrigger = ({ children, ...props }) => (
    <button type="button" {...props}>{children}</button>
  );

  const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
  const SelectContent = ({ children }) => <div>{children}</div>;

  const SelectItem = ({ value, children, ...props }) => {
    const ctx = React.useContext(SelectContext);
    return (
      <button
        type="button"
        onClick={() => ctx.onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  };

  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

// Mock framer-motion with generic passthrough components
jest.mock('framer-motion', () => {
  const React = require('react');
  const createComponent = (Tag = 'div') =>
    React.forwardRef((props, ref) => (
      <Tag ref={ref} {...props} />
    ));

  const motionProxy = new Proxy(
    {},
    {
      get: (_, key) => createComponent(key),
    }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Send: () => <span>Send Icon</span>,
}));

describe('ContactForm Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
    toast.error.mockClear();
    toast.success.mockClear();
  });

  test('renders contact form', () => {
    render(<ContactForm />);
    
    expect(screen.getByText(/Ваше имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Иван Петров/i)).toBeInTheDocument();
    expect(screen.getByText(/Телефон \/ Telegram/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\+7 \(999\) 123-45-67/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Получить консультацию/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /Получить консультацию/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Пожалуйста, заполните обязательные поля');
    });
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Спасибо! Мы свяжемся с вами в течение 15 минут' }
    });

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByPlaceholderText(/Иван Петров/i), {
      target: { value: 'Тест Пользователь' }
    });
    fireEvent.change(screen.getByPlaceholderText(/\+7 \(999\) 123-45-67/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText(/Цифровой аудит/i));
    fireEvent.change(screen.getByPlaceholderText(/Расскажите о вашем проекте/i), {
      target: { value: 'Тестовое сообщение' }
    });
    
    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /Получить консультацию/i });
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

    expect(toast.success).toHaveBeenCalledWith('Спасибо! Мы свяжемся с вами в течение 15 минут');
  });

  test('handles form submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByPlaceholderText(/Иван Петров/i), {
      target: { value: 'Тест Пользователь' }
    });
    fireEvent.change(screen.getByPlaceholderText(/\+7 \(999\) 123-45-67/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText(/Цифровой аудит/i));
    
    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /Получить консультацию/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Ошибка. Попробуйте ещё раз');
  });
});
