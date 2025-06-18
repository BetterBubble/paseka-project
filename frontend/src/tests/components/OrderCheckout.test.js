import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../../pages/Cart';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';

// Мок для fetch API
global.fetch = jest.fn((url) => {
  if (url === '/api/delivery-methods/') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        results: [
          { id: 1, name: 'Курьер', cost_policy: '500 ₽' },
          { id: 2, name: 'Самовывоз', cost_policy: 'Бесплатно' }
        ]
      })
    });
  }
  if (url === '/api/orders/') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        status: 'created',
        total_price: 1500
      })
    });
  }
  return Promise.reject(new Error('not found'));
});

// Мок для API запросов
const mockApi = {
  get: jest.fn((url) => {
    if (url === '/api/delivery-methods/') {
      return Promise.resolve({
        data: {
          results: [
            { id: 1, name: 'Курьер', cost_policy: '500 ₽' },
            { id: 2, name: 'Самовывоз', cost_policy: 'Бесплатно' }
          ]
        }
      });
    }
    return Promise.reject(new Error('Not found'));
  }),
  post: jest.fn((url) => {
    if (url === '/api/orders/') {
      return Promise.resolve({
        data: {
          id: 1,
          status: 'created',
          total_price: 1500
        }
      });
    }
    return Promise.reject(new Error('Not found'));
  })
};

// Мок для API
jest.mock('../../services/api', () => ({
  get: (url) => mockApi.get(url),
  post: (url, data) => mockApi.post(url, data)
}));

// Мок для контекста авторизации
const mockAuthContext = {
  user: { id: 1, email: 'test@example.com' },
  token: 'test-token',
  isAuthenticated: true
};

jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => <>{children}</>
}));

// Мок для контекста корзины
const mockCartItems = [
  {
    id: 1,
    product: {
      id: 1,
      name: 'Мёд цветочный',
      price: '1000',
      discount_price: null,
      image_url: 'honey.jpg',
      slug: 'flower-honey',
      category: { name: 'Мёд' }
    },
    quantity: 2,
    total_price: 2000
  }
];

const mockCartContext = {
  items: mockCartItems,
  totalPrice: 2000,
  loading: false,
  loadCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn()
};

jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => mockCartContext,
  CartProvider: ({ children }) => <>{children}</>
}));

// Функция для рендеринга компонента с провайдерами
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Оформление заказа', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('успешное оформление заказа', async () => {
    renderWithProviders(<Cart />);

    // Проверяем, что корзина загружена и отображаются товары
    expect(screen.getByText('Мёд цветочный')).toBeInTheDocument();
    const priceElements = screen.getAllByText('2000 ₽');
    expect(priceElements.length).toBeGreaterThan(0);

    // Находим и нажимаем кнопку оформления заказа
    const checkoutButton = screen.getByRole('button', { name: /Оформить заказ/i });
    fireEvent.click(checkoutButton);

    // Проверяем, что модальное окно открылось
    await waitFor(() => {
      expect(screen.getByText('Оформление заказа')).toBeInTheDocument();
    });

    // Ждем загрузки способов доставки
    await waitFor(() => {
      expect(screen.getByText('Курьер (500 ₽)')).toBeInTheDocument();
    });

    // Заполняем форму заказа
    const nameInput = screen.getByPlaceholderText('Введите ваше полное имя');
    const addressInput = screen.getByPlaceholderText('Город, улица, дом, квартира');
    const deliverySelect = screen.getByRole('combobox');

    fireEvent.change(nameInput, { target: { value: 'Иван Иванов' } });
    fireEvent.change(addressInput, { target: { value: 'г. Москва, ул. Пчеловодов, д. 1, кв. 1' } });
    fireEvent.change(deliverySelect, { target: { value: '1' } });

    // Нажимаем кнопку оплаты
    const payButton = screen.getByRole('button', { name: /Оплатить/i });
    fireEvent.click(payButton);

    // Проверяем, что заказ успешно оформлен
    await waitFor(() => {
      expect(screen.getByText('Заказ успешно оформлен!')).toBeInTheDocument();
    });

    // Проверяем, что корзина очищена
    expect(mockCartContext.clearCart).toHaveBeenCalled();
  });

  test('отображение ошибки при неудачном оформлении заказа', async () => {
    // Мокаем ошибку при создании заказа
    global.fetch = jest.fn()
      .mockImplementationOnce((url) => {
        if (url === '/api/delivery-methods/') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              results: [
                { id: 1, name: 'Курьер', cost_policy: '500 ₽' },
                { id: 2, name: 'Самовывоз', cost_policy: 'Бесплатно' }
              ]
            })
          });
        }
      })
      .mockImplementationOnce((url) => {
        if (url === '/api/orders/') {
          return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({
              error: 'Ошибка оформления заказа'
            })
          });
        }
      });

    renderWithProviders(<Cart />);

    // Находим и нажимаем кнопку оформления заказа
    const checkoutButton = screen.getByRole('button', { name: /Оформить заказ/i });
    fireEvent.click(checkoutButton);

    // Ждем загрузки способов доставки
    await waitFor(() => {
      expect(screen.getByText('Курьер (500 ₽)')).toBeInTheDocument();
    });

    // Заполняем форму заказа
    const nameInput = screen.getByPlaceholderText('Введите ваше полное имя');
    const addressInput = screen.getByPlaceholderText('Город, улица, дом, квартира');
    const deliverySelect = screen.getByRole('combobox');

    fireEvent.change(nameInput, { target: { value: 'Иван Иванов' } });
    fireEvent.change(addressInput, { target: { value: 'г. Москва, ул. Пчеловодов, д. 1, кв. 1' } });
    fireEvent.change(deliverySelect, { target: { value: '1' } });

    // Нажимаем кнопку оплаты
    const payButton = screen.getByRole('button', { name: /Оплатить/i });
    fireEvent.click(payButton);

    // Проверяем, что отображается сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(/Ошибка оформления заказа/i)).toBeInTheDocument();
    });

    // Проверяем, что корзина не очищена
    expect(mockCartContext.clearCart).not.toHaveBeenCalled();
  });

  test('проверка валидации формы заказа', async () => {
    // Мокаем fetch для загрузки способов доставки
    global.fetch = jest.fn()
      .mockImplementationOnce((url) => {
        if (url === '/api/delivery-methods/') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              results: [
                { id: 1, name: 'Курьер', cost_policy: '500 ₽' },
                { id: 2, name: 'Самовывоз', cost_policy: 'Бесплатно' }
              ]
            })
          });
        }
      });

    renderWithProviders(<Cart />);

    // Находим и нажимаем кнопку оформления заказа
    const checkoutButton = screen.getByRole('button', { name: /Оформить заказ/i });
    fireEvent.click(checkoutButton);

    // Ждем загрузки способов доставки
    await waitFor(() => {
      expect(screen.getByText('Курьер (500 ₽)')).toBeInTheDocument();
    });

    // Пытаемся отправить пустую форму
    const payButton = screen.getByRole('button', { name: /Оплатить/i });
    fireEvent.click(payButton);

    // Проверяем, что форма не отправлена
    expect(global.fetch).not.toHaveBeenCalledWith('/api/orders/');

    // Проверяем, что поля формы помечены как обязательные
    const nameInput = screen.getByPlaceholderText('Введите ваше полное имя');
    const addressInput = screen.getByPlaceholderText('Город, улица, дом, квартира');
    const deliverySelect = screen.getByRole('combobox');

    expect(nameInput).toBeRequired();
    expect(addressInput).toBeRequired();
    expect(deliverySelect).toBeRequired();
  });
}); 