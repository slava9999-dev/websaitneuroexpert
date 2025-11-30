/**
 * Centralized API client for NeuroExpert frontend
 * Provides consistent error handling, retries, and logging
 */

import axios from 'axios';
import { toast } from 'sonner';

class ApiClient {
  constructor() {
    // Determine base URL from environment
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim();
    this.baseURL = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api` : '/api';
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Centralized error handling
   */
  handleError(error) {
    const { response, request, message } = error;

    if (response) {
      // Server responded with error status
      const { status, data } = response;
      
      switch (status) {
        case 400:
          toast.error('Неверные данные. Проверьте форму и попробуйте снова.');
          break;
        case 401:
          toast.error('Требуется авторизация.');
          break;
        case 403:
          toast.error('Доступ запрещен.');
          break;
        case 429:
          toast.error('Слишком много запросов. Попробуйте позже.');
          break;
        case 500:
          toast.error('Ошибка сервера. Попробуйте позже.');
          break;
        case 503:
          toast.error('Сервис временно недоступен. Попробуйте позже.');
          break;
        default:
          toast.error(data?.detail || data?.message || 'Произошла ошибка.');
      }
      
      console.error(`❌ API Error ${status}:`, data);
    } else if (request) {
      // Network error
      toast.error('Проблемы с соединением. Проверьте интернет.');
      console.error('❌ Network Error:', request);
    } else {
      // Request configuration error
      toast.error('Ошибка запроса.');
      console.error('❌ Request Error:', message);
    }
  }

  /**
   * Send chat message with retry logic
   */
  async sendMessage(message, sessionId, model = 'claude-sonnet') {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.post('/chat', {
          session_id: sessionId,
          message: message,
          model: model,
        });

        return response.data;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`🔄 Retrying chat request in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Submit contact form
   */
  async submitContact(formData) {
    const response = await this.client.post('/contact', formData);
    return response.data;
  }

  /**
   * Check API health
   */
  async checkHealth() {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get chat service health
   */
  async getChatHealth() {
    const response = await this.client.get('/chat/health');
    return response.data;
  }

  /**
   * Get contact service health
   */
  async getContactHealth() {
    const response = await this.client.get('/contact/health');
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  sendMessage,
  submitContact,
  checkHealth,
  getChatHealth,
  getContactHealth,
} = apiClient;

export default apiClient;
