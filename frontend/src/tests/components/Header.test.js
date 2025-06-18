import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';

// Мок для API
jest.mock('../../services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: { results: [] } }))
}));

// Мок для контекста авторизации (неавторизованный пользователь)
const mockAuthContextUnauthorized = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false
};

// Мок для контекста авторизации (авторизованный пользователь)
const mockAuthContextAuthorized = {
  user: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  },
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true
};

// Мок для контекста корзины
jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => ({
    cartItems: [],
    totalItems: 0
  })
}));

// Мок для контекста авторизации
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContextUnauthorized
}));

const renderHeader = (isAuthenticated = false) => {
  // Обновляем мок для AuthContext в зависимости от параметра
  const mockAuthContext = isAuthenticated ? mockAuthContextAuthorized : mockAuthContextUnauthorized;
  jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => mockAuthContext);

  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('отображает логотип и все элементы навигации', async () => {
    renderHeader();
    
    // Проверяем наличие всех элементов навигации
    expect(screen.getByText(/Пасека/i)).toBeInTheDocument();
    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
    expect(screen.getByText(/Категории/i)).toBeInTheDocument();
    expect(screen.getByText(/О компании/i)).toBeInTheDocument();
    expect(screen.getByText(/Контакты/i)).toBeInTheDocument();
    expect(screen.getByText(/Корзина/i)).toBeInTheDocument();
  });

  test('отображает кнопки авторизации для неавторизованного пользователя', async () => {
    renderHeader(false);
    
    // Проверяем наличие кнопок входа и регистрации
    const authButtons = screen.getByTestId('auth-buttons');
    expect(authButtons).toBeInTheDocument();
    
    const loginButton = authButtons.querySelector('.login-btn');
    const registerButton = authButtons.querySelector('.register-btn');
    
    expect(loginButton).toHaveTextContent(/Войти/i);
    expect(registerButton).toHaveTextContent(/Регистрация/i);
  });

  test('мобильное меню открывается по клику', async () => {
    renderHeader();
    
    const menuButton = screen.getByTestId('mobile-menu-btn');
    fireEvent.click(menuButton);
    
    // Проверяем, что меню открылось
    await waitFor(() => {
      const navMenu = screen.getByTestId('navbar-nav');
      expect(navMenu.className).toContain('navbar-nav--open');
    });
  });

  test('корзина отображает правильную информацию', async () => {
    renderHeader();
    
    const cartLink = screen.getByRole('link', { name: /Корзина/i });
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  test('отображает профиль для авторизованного пользователя', async () => {
    renderHeader(true);
    
    // Проверяем отсутствие кнопок авторизации в хедере
    const authButtons = screen.queryByTestId('auth-buttons');
    expect(authButtons).not.toBeInTheDocument();
    
    // Проверяем наличие аватара с первой буквой имени пользователя
    const userAvatar = screen.getByTestId('user-avatar');
    expect(userAvatar).toHaveTextContent('T');
    
    // Проверяем наличие выпадающего меню профиля
    fireEvent.mouseEnter(userAvatar.closest('.profile-dropdown'));
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText(/Ваши заказы/i)).toBeInTheDocument();
      expect(screen.getByText(/Выйти/i)).toBeInTheDocument();
    });
  });

  test('выход из аккаунта работает корректно', async () => {
    renderHeader(true);
    
    // Находим аватар пользователя
    const userAvatar = screen.getByTestId('user-avatar');
    fireEvent.mouseEnter(userAvatar.closest('.profile-dropdown'));
    
    // Ждем появления кнопки выхода и кликаем по ней
    const logoutButton = await screen.findByText(/Выйти/i);
    fireEvent.click(logoutButton);
    
    // Проверяем, что функция выхода была вызвана
    expect(mockAuthContextAuthorized.logout).toHaveBeenCalled();
  });
}); 