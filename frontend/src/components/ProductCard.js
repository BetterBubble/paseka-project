import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from './LanguageSwitcher';
import { createPortal } from 'react-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, language } = useTranslations();
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [isHoveringDetails, setIsHoveringDetails] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Проверка наличия данных о товаре
  if (!product) {
    return <div className="card h-100 product-card shadow-sm">
      <div className="card-body">
        <p>{language === 'ru' ? 'Ошибка: товар не найден' : 'Error: product not found'}</p>
      </div>
    </div>;
  }

  const showAlert = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Обработчик добавления товара в корзину
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showAlert(language === 'ru' 
        ? 'Для добавления товаров в корзину необходимо войти в систему'
        : 'You need to log in to add products to cart', 'warning');
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      showAlert(t.addedToCart, 'success');
    } else {
      showAlert(result.error || (language === 'ru' ? 'Ошибка добавления в корзину' : 'Error adding to cart'), 'error');
    }
  };

  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);

  return (
    <>
      {showNotification && createPortal(
        <div className={`notification notification--${notificationType} show`}>
          <i className={`bi bi-${notificationType === 'success' ? 'check-circle' : notificationType === 'warning' ? 'exclamation-triangle' : 'x-circle'} me-2`}></i>
          {notificationMessage}
        </div>,
        document.body
      )}
      <div className="card product-card shadow-sm" style={{ height: '520px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="position-relative">
          {/* Резервируем место под бейдж скидки */}
          <div style={{ position: 'absolute', top: 0, left: 0, minHeight: '32px', minWidth: '60px', zIndex: 2 }}>
            {hasDiscount ? (
              <span className="badge bg-danger">
                -{Math.round(((parseFloat(product.price) - parseFloat(product.discount_price)) / parseFloat(product.price)) * 100)}%
              </span>
            ) : (
              <span style={{ visibility: 'hidden' }}>-00%</span>
            )}
          </div>
          {product.image_url ? (
            <img 
              className="card-img-top" 
              src={product.image_url}
              alt={product.name}
              style={{ 
                height: '250px', 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                e.target.src = '/static/images/no-image.png';
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
              }}
            />
          ) : (
            <div 
              data-testid="product-image-container"
              className="card-img-top d-flex align-items-center justify-content-center bg-light"
              style={{ height: '250px' }}
            >
              <i 
                data-testid="product-image-placeholder"
                className="bi bi-image text-muted"
                style={{ fontSize: '3rem' }}
              />
            </div>
          )}
        </div>
        <div className="card-body" style={{ padding: '0.7rem 0.7rem 0.4rem 0.7rem' }}>
          {/* Название товара */}
          <div className="text-center" style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
            <h5 className="card-title fw-bold mb-0" style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', whiteSpace: 'normal', wordBreak: 'break-word', width: '100%' }}>
              <Link 
                to={`/product/${product.slug}`} 
                className="text-decoration-none text-dark"
              >
                {product.name}
              </Link>
            </h5>
          </div>
          {/* Цена */}
          <div className="price-section" style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0 }}>
            <div className="fw-bold text-honey" style={{ fontSize: '1.08rem', width: '100%', textAlign: 'center', margin: 0, padding: 0 }}>
              {currentPrice} ₽
            </div>
          </div>
          {/* Рейтинг */}
          <div style={{ height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            {product.average_rating > 0 ? (
              <span className="text-warning" style={{ fontSize: '0.95rem' }}>
                {'★'.repeat(Math.floor(product.average_rating))}
                {'☆'.repeat(5 - Math.floor(product.average_rating))}
                <small className="text-muted ms-1">
                  ({product.reviews_count})
                </small>
              </span>
            ) : (
              <span style={{ visibility: 'hidden' }}>★★★★★</span>
            )}
          </div>
          {/* Кнопки действий */}
          <div style={{ margin: 0, padding: 0 }}>
            <div className="d-grid gap-2" style={{ gap: 0, margin: 0, padding: 0 }}>
              <button 
                onClick={handleAddToCart}
                disabled={!product.available || product.stock <= 0}
                onMouseEnter={() => setIsHoveringAdd(true)}
                onMouseLeave={() => setIsHoveringAdd(false)}
                style={{ 
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.45rem 0.5rem',
                  borderRadius: '0.75rem',
                  margin: 0,
                  background: isHoveringAdd && product.available && product.stock > 0 
                    ? 'linear-gradient(135deg, #daa520 0%, #b8860b 100%)'
                    : 'linear-gradient(135deg, #f4a460 0%, #daa520 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: product.available && product.stock > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  minHeight: '32px',
                  boxShadow: isHoveringAdd && product.available && product.stock > 0
                    ? '0 4px 12px rgba(218, 165, 32, 0.4)'
                    : '0 2px 6px rgba(244, 164, 96, 0.25)',
                  transform: isHoveringAdd && product.available && product.stock > 0 
                    ? 'translateY(-1px) scale(1.05)' 
                    : 'translateY(0) scale(1)',
                  width: '100%',
                  opacity: (!product.available || product.stock <= 0) ? 0.6 : 1
                }}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {product.available && product.stock > 0 ? t.addToCart : t.outOfStock}
              </button>
              <Link 
                to={`/product/${product.slug}`}
                onMouseEnter={() => setIsHoveringDetails(true)}
                onMouseLeave={() => setIsHoveringDetails(false)}
                style={{ 
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '0.75rem',
                  margin: 0,
                  background: isHoveringDetails 
                    ? 'linear-gradient(135deg, #f4a460 0%, #daa520 100%)'
                    : 'transparent',
                  color: isHoveringDetails ? 'white' : '#f4a460',
                  border: '1.5px solid #f4a460',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  minHeight: '32px',
                  boxShadow: isHoveringDetails
                    ? '0 4px 12px rgba(244, 164, 96, 0.3)'
                    : '0 2px 6px rgba(244, 164, 96, 0.15)',
                  transform: isHoveringDetails ? 'translateY(-1px)' : 'translateY(0)',
                  width: '100%'
                }}
              >
                {language === 'ru' ? 'Подробнее' : 'Details'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard; 