import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, totalPrice, loading, loadCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

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

  if (!user) {
    return (
      <div className="cart-modern-container">
        <div className="cart-modern-empty text-center animate__animated animate__fadeIn">
          <h2>Для просмотра корзины необходимо войти в систему</h2>
          <Link to="/" className="btn btn-honey mt-3">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
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
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-modern-container">
        <div className="cart-modern-empty text-center animate__animated animate__fadeIn">
          <h2 className="text-honey mb-4">Ваша корзина пуста</h2>
          <p className="text-muted mb-4">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link to="/" className="btn btn-honey">
            Перейти к покупкам
          </Link>
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
                </div>
                <div className="cart-modern-item-qty">
                  <button className="cart-modern-qty-btn" onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}>-</button>
                  <input 
                    type="number" 
                    className="cart-modern-qty-input"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <button className="cart-modern-qty-btn" onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}>+</button>
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
              <button className="cart-modern-order-btn animate__animated animate__pulse animate__infinite">
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 