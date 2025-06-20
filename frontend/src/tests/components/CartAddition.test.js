import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import ProductDetail from '../../pages/ProductDetail';
import ProductList from '../../pages/ProductList';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { LanguageProvider } from '../../components/LanguageSwitcher';


// Это тестовые данные, имитирующие реальный продукт из базы данных
const mockProduct = {
  id: 1,
  name: 'Мёд цветочный',
  price: '1000',
  discount_price: '800',
  image_url: 'honey-image.jpg',
  slug: 'flower-honey',
  available: true,
  stock: 10,
  description: 'Вкусный мёд с пасеки',
  category: { id: 1, name: 'Мёд', slug: 'honey' },
  manufacturer: 'ООО Пасека'
};

// Мок для API запросов
// Имитирует работу реального API, возвращая 
// тестовые данные вместо реальных запросов к серверу
const mockApi = {
  get: jest.fn((url) => {
    if (url === '/products/') {
      return Promise.resolve({ data: { results: [mockProduct] } });
    }
    if (url === `/products/${mockProduct.slug}/`) {
      return Promise.resolve({ data: mockProduct });
    }
    if (url === `/products/${mockProduct.slug}/reviews/`) {
      return Promise.resolve({ data: [] });
    }
    if (url === '/categories/') {
      return Promise.resolve({ 
        data: { 
          results: [mockProduct.category]
        } 
      });
    }
    if (url === `/products/?category=${mockProduct.category.slug}`) {
      return Promise.resolve({ data: { results: [mockProduct] } });
    }
    return Promise.reject(new Error('Not found'));
  })
};

// Мок для API
jest.mock('../../services/api', () => ({
  get: (url) => mockApi.get(url)
}));

// Мок для контекста авторизации
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com' },
    isAuthenticated: true
  }),
  AuthProvider: ({ children }) => <>{children}</>
}));

// Мок для переводов
jest.mock('../../components/LanguageSwitcher', () => ({
  ...jest.requireActual('../../components/LanguageSwitcher'),
  useTranslations: () => ({
    t: {
      addToCart: 'Добавить в корзину',
      outOfStock: 'Нет в наличии',
      discount: 'Скидка',
      details: 'Подробнее',
      addedToCart: 'Товар добавлен в корзину'
    },
    language: 'ru'
  }),
  LanguageProvider: ({ children }) => <>{children}</>
}));

// Мок для контекста корзины
const mockAddToCart = jest.fn().mockImplementation((productId, quantity = 1) => {
  return Promise.resolve({ success: true });
});

// Моки контекстов
// Имитирует работу контекста корзины, авторизации и переводов
const mockCartContext = {
  cartItems: [],
  addToCart: mockAddToCart,
  totalItems: 0,
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  updateQuantity: jest.fn()
};

jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => mockCartContext,
  CartProvider: ({ children }) => <>{children}</>
}));

// Обертка для компонентов с необходимыми провайдерами
// Оборачивает тестируемые компоненты необходимыми провайдерами контекста.
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            {component}
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Обертка для компонентов с роутингом
const renderWithRouting = (initialEntry) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/product/:productSlug" element={<ProductDetail />} />
              <Route path="/category/:categorySlug" element={<ProductList />} />
            </Routes>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Добавление товара в корзину', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Добавление с карточки товара', () => {
    test('товар добавляется в корзину из карточки товара', async () => {
      renderWithProviders(<ProductCard product={mockProduct} />);

      const addToCartButton = screen.getByRole('button', { name: /Добавить в корзину/i });
      expect(addToCartButton).toBeInTheDocument();

      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id, 1);
      });
    });

    test('нельзя добавить товар, которого нет в наличии', () => {
      const unavailableProduct = { ...mockProduct, available: false, stock: 0 };
      renderWithProviders(<ProductCard product={unavailableProduct} />);

      const addToCartButton = screen.getByRole('button');
      expect(addToCartButton).toBeDisabled();
      expect(addToCartButton).toHaveTextContent('Нет в наличии');
    });
  });

  describe('Добавление со страницы товара', () => {
    test('можно указать количество товара при добавлении в корзину', async () => {
      // Устанавливаем роутинг для ProductDetail
      renderWithRouting('/product/flower-honey');

      // Ждем загрузки товара
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(`/products/${mockProduct.slug}/`);
      });

      // Ждем загрузки отзывов
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(`/products/${mockProduct.slug}/reviews/`);
      });

      // Ждем загрузки товара
      await waitFor(() => {
        expect(screen.getByText('Количество:')).toBeInTheDocument();
      });

      // Находим кнопки управления количеством
      const plusButton = screen.getByRole('button', { name: 'Увеличить количество' });
      expect(plusButton).toBeInTheDocument();

      // Увеличиваем количество товара
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);

      // Нажимаем кнопку добавления в корзину
      const addToCartButton = screen.getByRole('button', { name: /Добавить в корзину/i });
      fireEvent.click(addToCartButton);

      // Проверяем, что функция добавления была вызвана с правильными параметрами
      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id, 3);
      });
    });
  });

  describe('Добавление из списка товаров', () => {
    test('товар добавляется в корзину из списка товаров', async () => {
      // Устанавливаем роутинг для ProductList
      renderWithRouting('/category/honey');

      // Ждем загрузки товаров и категорий
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(`/products/?category=honey`);
        expect(mockApi.get).toHaveBeenCalledWith('/categories/');
      });

      // Ждем загрузки товаров
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Добавить в корзину/i })).toBeInTheDocument();
      });

      // Находим кнопку добавления в корзину
      const addToCartButton = screen.getByRole('button', { name: /Добавить в корзину/i });
      expect(addToCartButton).toBeInTheDocument();

      // Нажимаем кнопку добавления в корзину
      fireEvent.click(addToCartButton);

      // Проверяем, что функция добавления была вызвана с правильными параметрами
      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id, 1);
      });
    });
  });
}); 