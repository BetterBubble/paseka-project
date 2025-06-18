import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Проверяем авторизацию при изменении токена
  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Проверка валидности токена и получение данных пользователя
  const checkAuth = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/current-user/');
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        // Уведомляем о том, что пользователь вошел в систему
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // Авторизация пользователя
  const login = async (username, password) => {
    try {
      const response = await api.post('/login/', {
        username,
        password
      });

      const data = response.data;

      if (data.success) {
        // Сохраняем токен и данные пользователя
        const authToken = data.token;
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        setUser(data.user);
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Неверное имя пользователя или пароль' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Произошла ошибка при входе' };
    }
  };

  // Выход из системы
  const logout = async () => {
    if (!token) {
      setUser(null);
      return { success: true };
    }

    try {
      await api.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // В любом случае очищаем данные пользователя
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    }
    return { success: true };
  };

  // Регистрация нового пользователя
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/register/', {
        username,
        email,
        password
      });

      const data = response.data;

      if (data.success) {
        // Автоматический вход после регистрации
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('authToken', data.token);
          setUser(data.user);
          window.dispatchEvent(new CustomEvent('userLoggedIn'));
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Ошибка регистрации' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.error || 'Произошла ошибка при регистрации' };
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    register,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 