import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { LanguageProvider } from '../../components/LanguageSwitcher';

// Мок для контекста корзины
jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => ({
    addToCart: jest.fn().mockResolvedValue({ success: true }),
    cartItems: [],
    totalItems: 0
  })
}));

// Мок для контекста авторизации
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com' },
    isAuthenticated: true
  })
}));

// Мок для переводов
jest.mock('../../components/LanguageSwitcher', () => ({
  ...jest.requireActual('../../components/LanguageSwitcher'),
  useTranslations: () => ({
    t: {
      addToCart: 'Добавить в корзину',
      outOfStock: 'Нет в наличии',
      discount: 'Скидка',
      details: 'Подробнее'
    },
    language: 'ru'
  }),
  LanguageProvider: ({ children }) => <>{children}</>
}));

// Обертка для компонента с необходимыми провайдерами
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

describe('ProductCard Component', () => {
  // Базовый товар со всеми полями
  const baseProduct = {
    id: 1,
    name: 'Мёд цветочный',
    price: '1000',
    discount_price: '800',
    image_url: 'honey-image.jpg',
    slug: 'flower-honey',
    available: true,
    stock: 10,
    description: 'Вкусный мёд с пасеки',
    category: 'honey',
    manufacturer: 'ООО Пасека'
  };

  // Товар без скидки
  const productWithoutDiscount = {
    ...baseProduct,
    discount_price: null
  };

  // Товар без изображения
  const productWithoutImage = {
    ...baseProduct,
    image_url: null
  };

  // Товар с длинным названием
  const productWithLongName = {
    ...baseProduct,
    name: 'Очень длинное название мёда цветочного горного алтайского высокогорного натурального'
  };

  // Товар с нулевым количеством
  const outOfStockProduct = {
    ...baseProduct,
    available: false,
    stock: 0
  };

  // Товар с минимальным остатком
  const lowStockProduct = {
    ...baseProduct,
    stock: 1
  };

  // Товар с максимальной скидкой
  const maxDiscountProduct = {
    ...baseProduct,
    price: '2000',
    discount_price: '1000'
  };

  describe('Базовые тесты отображения', () => {
    test('рендерит карточку товара с базовыми данными', () => {
      renderWithProviders(<ProductCard product={baseProduct} />);
      
      expect(screen.getByText('Мёд цветочный')).toBeInTheDocument();
      expect(screen.getByText(/800/)).toBeInTheDocument();
      expect(screen.getByText(/₽/)).toBeInTheDocument();
      
      const productImage = screen.getByRole('img');
      expect(productImage).toBeInTheDocument();
      expect(productImage).toHaveAttribute('src', 'honey-image.jpg');
      expect(productImage).toHaveAttribute('alt', 'Мёд цветочный');
    });

    test('корректно обрабатывает длинные названия товаров', () => {
      renderWithProviders(<ProductCard product={productWithLongName} />);
      
      const title = screen.getByText(/Очень длинное название/);
      expect(title).toBeInTheDocument();
      // Проверяем, что контейнер заголовка имеет ограничение по высоте
      expect(title.closest('h5')).toHaveStyle({ height: '32px' });
    });
  });

  describe('Тесты скидок и цен', () => {
    test('отображает скидку 20%', () => {
      renderWithProviders(<ProductCard product={baseProduct} />);
      
      const discountBadge = screen.getByText(/-20%/);
      expect(discountBadge).toBeInTheDocument();
      expect(discountBadge.closest('span')).toHaveClass('badge', 'bg-danger');
    });

    test('отображает максимальную скидку 50%', () => {
      renderWithProviders(<ProductCard product={maxDiscountProduct} />);
      
      const discountBadge = screen.getByText(/-50%/);
      expect(discountBadge).toBeInTheDocument();
      expect(discountBadge.closest('span')).toHaveClass('badge', 'bg-danger');
    });

    test('не отображает скидку для товара без скидки', () => {
      renderWithProviders(<ProductCard product={productWithoutDiscount} />);
      
      const discountBadge = screen.queryByText(/-\d+%/);
      expect(discountBadge).not.toBeVisible();
      expect(screen.getByText(/1000/)).toBeInTheDocument();
    });
  });

  describe('Тесты доступности товара', () => {
    test('отображает статус "Нет в наличии"', () => {
      renderWithProviders(<ProductCard product={outOfStockProduct} />);
      
      const outOfStockButton = screen.getByRole('button');
      expect(outOfStockButton).toHaveTextContent('Нет в наличии');
      expect(outOfStockButton).toBeDisabled();
    });

    test('отображает активную кнопку добавления для товара в наличии', () => {
      renderWithProviders(<ProductCard product={lowStockProduct} />);
      
      const addToCartButton = screen.getByRole('button');
      expect(addToCartButton).toBeEnabled();
      expect(addToCartButton).toHaveTextContent('Добавить в корзину');
    });
  });

  describe('Тесты изображений', () => {
    test('отображает заглушку при отсутствии изображения', () => {
      renderWithProviders(<ProductCard product={productWithoutImage} />);
      
      // Находим контейнер с классом card-img-top
      const placeholderContainer = screen.getByTestId('product-image-container');
      expect(placeholderContainer).toBeInTheDocument();
      expect(placeholderContainer).toHaveClass('card-img-top', 'd-flex', 'align-items-center', 'justify-content-center', 'bg-light');
      
      // Проверяем наличие иконки-заглушки внутри контейнера
      const placeholderIcon = within(placeholderContainer).getByTestId('product-image-placeholder');
      expect(placeholderIcon).toBeInTheDocument();
      expect(placeholderIcon).toHaveClass('bi', 'bi-image', 'text-muted');
    });
  });

  describe('Тесты интерактивности', () => {
    test('кнопка "Подробнее" ведёт на правильный URL', () => {
      renderWithProviders(<ProductCard product={baseProduct} />);
      
      const detailsButton = screen.getByText('Подробнее');
      expect(detailsButton).toBeInTheDocument();
      expect(detailsButton.closest('a')).toHaveAttribute('href', `/product/${baseProduct.slug}`);
    });

    test('отображает уведомление при добавлении в корзину', async () => {
      renderWithProviders(<ProductCard product={baseProduct} />);
      
      const addToCartButton = screen.getByRole('button');
      expect(addToCartButton).toHaveTextContent('Добавить в корзину');
      fireEvent.click(addToCartButton);
      
      expect(addToCartButton).toBeInTheDocument();
    });
  });
}); 