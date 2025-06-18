import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем Bearer токен для авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Обработка ответов
api.interceptors.response.use(
  (response) => {
    // Добавляем отладочную информацию
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response);
    return response;
  },
  (error) => {
    // Добавляем отладочную информацию
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    if (error.response?.status === 401) {
      // Токен недействителен, очищаем localStorage
      localStorage.removeItem('authToken');
      console.log('Токен недействителен, требуется повторная авторизация');
      // Можно добавить редирект на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 