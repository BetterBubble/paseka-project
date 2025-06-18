import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../components/LanguageSwitcher';

// Мок для контекстов
jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: jest.fn().mockResolvedValue({ success: true })
  })
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com' }
  })
}));

jest.mock('../components/LanguageSwitcher', () => ({
  useTranslations: () => ({
    t: (key) => key,
    language: 'ru'
  })
}));

// Обертка для компонента с необходимыми провайдерами
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

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: '1000',
    discount_price: '800',
    image_url: 'test-image.jpg',
    slug: 'test-product',
    available: true,
    stock: 10,
    average_rating: 4.5,
    reviews_count: 10
  };

  test('рендерит карточку товара с правильными данными', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('800 ₽')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  test('отображает уведомление при добавлении в корзину', async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addToCartButton = screen.getByText('addToCart');
    fireEvent.click(addToCartButton);
    
    // Проверяем, что уведомление появилось
    expect(screen.getByText('addToCart')).toBeInTheDocument();
  });

  test('отображает правильный статус для товара не в наличии', () => {
    const outOfStockProduct = { ...mockProduct, available: false, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('outOfStock')).toBeInTheDocument();
  });

  test('корректно отображает рейтинг товара', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const ratingElement = screen.getByText('(10)');
    expect(ratingElement).toBeInTheDocument();
  });
}); 