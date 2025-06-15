import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Загрузка данных о товаре при изменении slug
  useEffect(() => {
    loadProduct();
  }, [productSlug]);

  // Загрузка информации о товаре и отзывах
  const loadProduct = async () => {
    try {
      setLoading(true);
      const [productResponse, reviewsResponse] = await Promise.all([
        api.get(`/products/${productSlug}/`),
        api.get(`/products/${productSlug}/reviews/`)
      ]);
      
      setProduct(productResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик добавления товара в корзину
  const handleAddToCart = async () => {
    if (!user) {
      alert('Для добавления товаров в корзину необходимо войти в систему');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Товар добавлен в корзину!');
    } else {
      alert(result.error || 'Ошибка добавления в корзину');
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  // Отображение ошибки, если товар не найден
  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Товар не найден</h2>
        </div>
      </div>
    );
  }

  const currentPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Изображение товара */}
        <div className="col-md-6 mb-4">
          {product.image_url && (
            <img 
              src={product.image_url}
              alt={product.name}
              className="img-fluid rounded shadow"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        {/* Информация о товаре */}
        <div className="col-md-6">
          <h1 className="text-honey mb-3">{product.name}</h1>
          
          {/* Цена товара */}
          <div className="mb-3">
            {hasDiscount ? (
              <>
                <span className="text-muted text-decoration-line-through fs-5 me-2">
                  {product.price} ₽
                </span>
                <span className="text-danger fw-bold fs-3">
                  {product.discount_price} ₽
                </span>
              </>
            ) : (
              <span className="fw-bold text-honey fs-3">
                {product.price} ₽
              </span>
            )}
          </div>

          {/* Рейтинг товара */}
          {product.average_rating > 0 && (
            <div className="mb-3">
              <span className="text-warning fs-5">
                {'★'.repeat(Math.floor(product.average_rating))}
                {'☆'.repeat(5 - Math.floor(product.average_rating))}
              </span>
              <span className="text-muted ms-2">
                ({product.reviews_count} отзывов)
              </span>
            </div>
          )}

          <p className="mb-4">{product.description}</p>

          {/* Дополнительная информация */}
          <div className="mb-3">
            <strong>Категория:</strong> {product.category?.name}
          </div>

          <div className="mb-3">
            <strong>В наличии:</strong> {product.stock} шт.
          </div>

          {/* Выбор количества */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="quantity" className="form-label">Количество:</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <button 
            className="btn btn-honey btn-lg"
            onClick={handleAddToCart}
            disabled={!product.available || product.stock <= 0}
          >
            <i className="bi bi-cart-plus me-2"></i>
            {product.available && product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>

      {/* Секция отзывов */}
      {reviews.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-honey mb-4">Отзывы</h3>
            {reviews.map((review) => (
              <div key={review.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{review.user}</h6>
                    <span className="text-warning">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="card-text">{review.comment}</p>
                  <small className="text-muted">
                    {new Date(review.created).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 