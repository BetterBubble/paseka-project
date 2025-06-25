import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderModal from '../components/OrderModal';

const Cart = () => {
  const { items, totalPrice, loading, loadCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, token } = useAuth();
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  // Добавляем стили для уведомления о недоступности товара
  const styles = {
    cartModernItemAvailability: {
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      await clearCart();
    }
  };

  const handleOrderSubmit = async ({ fullName, address, deliveryMethod }) => {
    const authToken = token || localStorage.getItem('authToken');
    console.log('user:', user);
    console.log('token:', authToken);
    if (!authToken) {
      throw new Error('Для оформления заказа необходимо войти в систему.');
    }

    // Проверяем доступность товаров перед оформлением заказа
    const unavailableItems = items.filter(item => !item.available);
    if (unavailableItems.length > 0) {
      throw new Error('В корзине есть недоступные товары. Пожалуйста, удалите их перед оформлением заказа.');
    }
    
    try {
      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          full_name: fullName,
          delivery_address: address,
          delivery_method: deliveryMethod,
          items: items.map(item => ({
            product: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Не удалось создать заказ. Попробуйте снова.';
        try {
          const errorData = await response.json();
          console.error('Ошибка создания заказа:', errorData);
          // Если есть конкретное сообщение об ошибке от сервера
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Если не удается распарсить JSON, используем статус ответа
          if (response.status === 401) {
            errorMessage = 'Сессия истекла. Войдите в систему заново.';
          } else if (response.status === 400) {
            errorMessage = 'Некорректные данные заказа. Проверьте заполненные поля.';
          } else if (response.status === 500) {
            errorMessage = 'Внутренняя ошибка сервера. Попробуйте позже.';
          }
          console.error('Ошибка парсинга ответа:', parseError);
        }
        throw new Error(errorMessage);
      }

      const order = await response.json();
      console.log('Заказ успешно создан:', order);
      
      // Очищаем корзину после успешного оформления заказа
      await clearCart();
      
      return order;
    } catch (error) {
      console.error('Полная ошибка при создании заказа:', error);
      throw error; // Перебрасываем ошибку в OrderModal
    }
  };

  if (!user) {
    return (
      <div className="cart-honey-bg">
      <div className="cart-modern-container">
        <div className="cart-modern-empty text-center animate__animated animate__fadeIn">
          <h2>Для просмотра корзины необходимо войти в систему</h2>
          <Link to="/" className="btn btn-honey mt-3">
            На главную
          </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-honey-bg">
      <div className="cart-modern-container">
        <div className="cart-modern-loading text-center animate__animated animate__fadeIn">
          <div className="honey-spinner">
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
          </div>
          <p className="loading-text">Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-honey-bg">
      <div className="cart-modern-container">
        <div className="cart-modern-empty text-center animate__animated animate__fadeIn">
          <h2 className="text-honey mb-4">Ваша корзина пуста</h2>
          <p className="text-muted mb-4">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link to="/" className="btn btn-honey">
            Перейти к покупкам
          </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-honey-bg">
      <div className="cart-modern-container animate__animated animate__fadeInUp">
        <div className="cart-modern-header">
          <h2 className="cart-modern-title">🛒 Ваша корзина</h2>
          <button className="cart-modern-clear-btn" onClick={handleClearCart}>
            <i className="bi bi-trash3"></i> Очистить корзину
          </button>
        </div>
        <div className="cart-modern-content">
          <div className="cart-modern-items">
            {items.map((item) => (
              <div key={item.id} className="cart-modern-item animate__animated animate__fadeInUp">
                <div className="cart-modern-item-img-wrap">
                  {item.product.image_url && (
                    <img 
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="cart-modern-item-img"
                      onError={e => (e.target.style.display = 'none')}
                    />
                  )}
                </div>
                <div className="cart-modern-item-info">
                  <Link to={`/product/${item.product.slug}`} className="cart-modern-item-title">
                    {item.product.name}
                  </Link>
                  <div className="cart-modern-item-category">
                    {item.product.category?.name}
                  </div>
                  <div className="cart-modern-item-price">
                    {item.product.discount_price || item.product.price} ₽
                  </div>
                  {!item.available && (
                    <div className="cart-modern-item-availability text-danger" style={styles.cartModernItemAvailability}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      Товар временно недоступен
                    </div>
                  )}
                </div>
                <div className="cart-modern-item-qty">
                  <button 
                    className="cart-modern-qty-btn" 
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={!item.available}
                  >-</button>
                  <input 
                    type="number" 
                    className="cart-modern-qty-input"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                    min="0"
                    disabled={!item.available}
                  />
                  <button 
                    className="cart-modern-qty-btn" 
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    disabled={!item.available}
                  >+</button>
                </div>
                <div className="cart-modern-item-total">
                  {item.total_price} ₽
                </div>
                <button className="cart-modern-remove-btn" onClick={() => handleRemoveItem(item.product.id)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-modern-summary animate__animated animate__fadeInRight">
            <div className="cart-modern-summary-card">
              <h4 className="cart-modern-summary-title">Итого</h4>
              <div className="cart-modern-summary-row">
                <span>Товаров:</span>
                <span>{items.reduce((total, item) => total + item.quantity, 0)} шт.</span>
              </div>
              <div className="cart-modern-summary-row">
                <span>Сумма:</span>
                <span className="cart-modern-summary-price">{totalPrice} ₽</span>
              </div>
              <button className="cart-modern-order-btn animate__animated animate__pulse animate__infinite" onClick={() => setOrderModalOpen(true)}>
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Cart; 