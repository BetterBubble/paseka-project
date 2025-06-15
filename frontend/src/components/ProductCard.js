import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!product) {
    console.error('ProductCard: product is undefined');
    return <div className="card h-100 product-card shadow-sm">
      <div className="card-body">
        <p>Ошибка: товар не найден</p>
      </div>
    </div>;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Для добавления товаров в корзину необходимо войти в систему');
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      alert('Товар добавлен в корзину!');
    } else {
      alert(result.error || 'Ошибка добавления в корзину');
    }
  };

  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="position-relative">
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
              console.log('Ошибка загрузки изображения:', product.image_url);
            }}
          />
        ) : (
          <div 
            className="card-img-top d-flex align-items-center justify-content-center bg-light"
            style={{ height: '250px' }}
          >
            <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
          </div>
        )}
        
        {hasDiscount && (
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-danger">
              -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="text-center mb-3">
          <h5 className="card-title fw-bold mb-3">
            <Link 
              to={`/product/${product.slug}`} 
              className="text-decoration-none text-dark"
            >
              {product.name}
            </Link>
          </h5>

          <div className="price-section mb-3">
            {hasDiscount ? (
              <div>
                <div className="text-muted text-decoration-line-through mb-1" style={{ fontSize: '1rem' }}>
                  {product.price} ₽
                </div>
                <div className="fw-bold text-honey" style={{ fontSize: '1.5rem' }}>
                  {product.discount_price} ₽
                </div>
              </div>
            ) : (
              <div className="fw-bold text-honey" style={{ fontSize: '1.5rem' }}>
                {product.price} ₽
              </div>
            )}
          </div>

          {product.average_rating > 0 && (
            <div className="mb-2">
              <span className="text-warning">
                {'★'.repeat(Math.floor(product.average_rating))}
                {'☆'.repeat(5 - Math.floor(product.average_rating))}
              </span>
              <small className="text-muted ms-1">
                ({product.reviews_count})
              </small>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <button 
              className="btn btn-honey btn-lg"
              onClick={handleAddToCart}
              disabled={!product.available || product.stock <= 0}
              style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem'
              }}
            >
              <i className="bi bi-cart-plus me-2"></i>
              {product.available && product.stock > 0 ? 'В корзину' : 'Нет в наличии'}
            </button>
            <Link 
              to={`/product/${product.slug}`}
              className="btn btn-outline-honey"
              style={{ 
                fontSize: '0.95rem',
                fontWeight: '500',
                padding: '0.6rem 1rem',
                borderRadius: '0.75rem'
              }}
            >
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 