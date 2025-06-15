import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Проверяю авторизацию с токеном...');
      const response = await fetch('http://localhost:8000/api/current-user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Ответ сервера:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Данные пользователя:', data);
        if (data.success && data.user) {
          setUser(data.user);
          // Уведомляем о том, что пользователь вошел в систему
          window.dispatchEvent(new CustomEvent('userLoggedIn'));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      } else {
        console.log('Токен недействителен, статус:', response.status);
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.log('Ошибка проверки авторизации:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Сохраняем токен
        const authToken = data.token;
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        
        // Устанавливаем пользователя
        setUser(data.user);
        
        // Уведомляем о том, что пользователь вошел в систему
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Неверное имя пользователя или пароль' };
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: 'Произошла ошибка при входе' };
    }
  };

  const logout = async () => {
    if (!token) {
      setUser(null);
      return { success: true };
    }

    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Независимо от ответа сервера, очищаем локальные данные
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка выхода:', error);
      // Все равно очищаем локальные данные
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      return { success: true };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // После успешной регистрации автоматически входим
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('authToken', data.token);
          setUser(data.user);
          // Уведомляем о том, что пользователь вошел в систему
          window.dispatchEvent(new CustomEvent('userLoggedIn'));
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Ошибка регистрации' };
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: 'Произошла ошибка при регистрации' };
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