import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Refs для анимаций
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const tabsRef = useRef(null);
  const reviewsRef = useRef(null);
  const relatedRef = useRef(null);

  // Данные о продукте для демонстрации
  const mockProductData = {
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ],
    features: [
      { icon: '🌿', title: 'Натуральный', description: '100% натуральный продукт без добавок' },
      { icon: '🏆', title: 'Премиум качество', description: 'Высочайшее качество продукции' },
      { icon: '🚚', title: 'Быстрая доставка', description: 'Доставка в течение 1-2 дней' },
      { icon: '💯', title: 'Гарантия', description: 'Гарантия качества и возврата' }
    ],
    nutritionFacts: [
      { label: 'Калории', value: '304 ккал/100г' },
      { label: 'Белки', value: '0.3 г' },
      { label: 'Жиры', value: '0 г' },
      { label: 'Углеводы', value: '82.4 г' },
      { label: 'Влажность', value: '18-20%' }
    ],
    benefits: [
      'Укрепляет иммунную систему',
      'Обладает антибактериальными свойствами',
      'Улучшает пищеварение',
      'Повышает энергию и работоспособность',
      'Помогает при простудных заболеваниях'
    ]
  };

  useEffect(() => {
    loadProduct();
    
    // Анимации при загрузке
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, infoRef.current, tabsRef.current, reviewsRef.current, relatedRef.current].filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [productSlug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const [productResponse, reviewsResponse] = await Promise.all([
        api.get(`/products/${productSlug}/`),
        api.get(`/products/${productSlug}/reviews/`)
      ]);
      
      setProduct(productResponse.data);
      setReviews(reviewsResponse.data);
      
      // Загружаем похожие товары
      if (productResponse.data.category) {
        try {
          const relatedResponse = await api.get(`/products/?category=${productResponse.data.category.id}&limit=4`);
          const related = (relatedResponse.data.results || relatedResponse.data)
            .filter(p => p.id !== productResponse.data.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } catch (error) {
          console.error('Ошибка загрузки похожих товаров:', error);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showAlert('Для добавления товаров в корзину необходимо войти в систему', 'warning');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      showAlert('Товар успешно добавлен в корзину!', 'success');
    } else {
      showAlert(result.error || 'Ошибка добавления в корзину', 'error');
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    showAlert(
      isWishlisted ? 'Товар удален из избранного' : 'Товар добавлен в избранное', 
      'success'
    );
  };

  const showAlert = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-container">
          <div className="honey-spinner">
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
          </div>
          <p className="loading-text">Загружаем информацию о товаре...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <div className="not-found-content">
            <div className="not-found-icon">📦</div>
            <h1>Товар не найден</h1>
            <p>К сожалению, запрашиваемый товар не существует или был удален</p>
            <Link to="/" className="btn btn-honey btn-lg">
              <i className="bi bi-arrow-left me-2"></i>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.discount_price / product.price) * 100) : 0;

  return (
    <div className="product-detail-page" style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#fffbe6',
      zIndex: 1
    }}>
      {/* Notification */}
      {showNotification && (
        <div className={`notification notification--${notificationType} ${showNotification ? 'show' : ''}`}>
          <i className={`bi bi-${notificationType === 'success' ? 'check-circle' : notificationType === 'warning' ? 'exclamation-triangle' : 'x-circle'} me-2`}></i>
          {notificationMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-item">
              <i className="bi bi-house-door"></i>
              Главная
            </Link>
            <span className="breadcrumb-separator">›</span>
            {product.category && (
              <>
                <Link to={`/category/${product.category.slug}`} className="breadcrumb-item">
                  {product.category.name}
                </Link>
                <span className="breadcrumb-separator">›</span>
              </>
            )}
            <span className="breadcrumb-current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="product-hero">
        <div className="container">
          <div className="row align-items-start">
            {/* Product Gallery */}
            <div className="col-lg-6">
              <div className="product-gallery">
                <div className="main-image-container">
                  <div className="image-badges">
                    {hasDiscount && (
                      <div className="discount-badge">
                        -{discountPercent}%
                      </div>
                    )}
                    {!product.available || product.stock <= 0 && (
                      <div className="out-of-stock-badge">
                        Нет в наличии
                      </div>
                    )}
                  </div>
                  <img 
                    src={product.image_url || mockProductData.images[selectedImage]}
                    alt={product.name}
                    className="main-product-image"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/600/600';
                    }}
                  />
                  <div className="image-zoom-btn">
                    <i className="bi bi-arrows-fullscreen"></i>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="thumbnail-gallery">
                  {mockProductData.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
                {/* Additional Info - теперь под картинкой, горизонтально */}
                <div className="additional-info horizontal mt-4">
                  <div className="info-item">
                    <i className="bi bi-tag"></i>
                    <span>Категория: {product.category?.name}</span>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Гарантия качества</span>
                  </div>
                  <div className="info-item highlight">
                    <i className="bi bi-truck"></i>
                    <span>Бесплатная доставка от 2000 ₽</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="product-info">
                <div className="product-header">
                  <h1 className="product-title">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="product-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`bi bi-star${i < Math.floor(product.average_rating || 0) ? '-fill' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.average_rating ? product.average_rating.toFixed(1) : '0.0'} 
                      ({product.reviews_count || 0} отзывов)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="product-price">
                    {hasDiscount && (
                      <span className="old-price">{product.price} ₽</span>
                    )}
                    <span className="current-price">{currentPrice} ₽</span>
                    {hasDiscount && (
                      <span className="discount-label">Скидка {discountPercent}%</span>
                    )}
                  </div>
                </div>

                {/* Product Features */}
                <div className="product-features">
                  {mockProductData.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">{feature.icon}</div>
                      <div className="feature-content">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity Selector */}
                <div className="quantity-section">
                  <label className="section-label">Количество:</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <span className="stock-info">В наличии: {product.stock} шт.</span>
                </div>

                {/* Action Buttons */}
                <div className="product-actions">
                  <button 
                    className="btn btn-honey btn-lg add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.available || product.stock <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {product.available && product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                  </button>
                  
                  <button 
                    className={`btn btn-outline-honey wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    <i className={`bi bi-heart${isWishlisted ? '-fill' : ''} me-2`}></i>
                    {isWishlisted ? 'В избранном' : 'В избранное'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Information Tabs */}
      <section ref={tabsRef} className="product-tabs-section">
        <div className="container">
          <div className="tabs-navigation">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              <i className="bi bi-file-text me-2"></i>
              Описание
            </button>
            <button 
              className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition')}
            >
              <i className="bi bi-list-ul me-2"></i>
              Состав
            </button>
            <button 
              className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
              onClick={() => setActiveTab('benefits')}
            >
              <i className="bi bi-heart-pulse me-2"></i>
              Польза
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel description-panel">
                <h3>Описание товара</h3>
                <p className="product-description">{product.description}</p>
                <div className="description-features">
                  <h4>Особенности продукта:</h4>
                  <ul>
                    <li>100% натуральный продукт без добавок и консервантов</li>
                    <li>Собран на экологически чистых пасеках</li>
                    <li>Прошел лабораторные исследования качества</li>
                    <li>Упакован с соблюдением всех стандартов</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="tab-panel nutrition-panel">
                <h3>Пищевая ценность</h3>
                <div className="nutrition-table">
                  {mockProductData.nutritionFacts.map((fact, index) => (
                    <div key={index} className="nutrition-row">
                      <span className="nutrition-label">{fact.label}:</span>
                      <span className="nutrition-value">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="tab-panel benefits-panel">
                <h3>Полезные свойства</h3>
                <div className="benefits-grid">
                  {mockProductData.benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section ref={reviewsRef} className="reviews-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <i className="bi bi-chat-dots me-2"></i>
                Отзывы покупателей
              </h2>
              <p className="section-subtitle">
                Что говорят наши клиенты о данном товаре
              </p>
            </div>

            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="review-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.user}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star${i < review.rating ? '-fill' : ''}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="review-date">
                      {new Date(review.created).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section ref={relatedRef} className="related-products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <i className="bi bi-collection me-2"></i>
                Похожие товары
              </h2>
              <p className="section-subtitle">
                Возможно, вас также заинтересуют эти товары
              </p>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct, index) => (
                <div 
                  key={relatedProduct.id} 
                  className="related-product-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail; 