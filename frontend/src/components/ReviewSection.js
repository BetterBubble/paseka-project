import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReviewSection.css';
import api from '../services/api';

const ReviewSection = ({ reviews, productId, onReviewAdded }) => {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setError('Пожалуйста, войдите в систему, чтобы оставить отзыв');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await api.post('/reviews/', {
        product: productId,
        rating,
        comment
      });

      if (response.data) {
        // Добавляем информацию о пользователе к отзыву
        const newReview = {
          ...response.data,
          user: response.data.user || user.username
        };
        onReviewAdded(newReview);
        setComment('');
        setRating(5);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.error || 'Ошибка при отправке отзыва. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i 
        key={index}
        className={`bi bi-star${rating > index ? '-fill' : ''}`}
        style={{ color: '#ffc107' }}
      />
    ));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getUserInitial = (review) => {
    if (typeof review.user === 'string') {
      return review.user[0].toUpperCase();
    }
    return review.user?.username?.[0]?.toUpperCase() || '?';
  };

  const getUsername = (review) => {
    if (typeof review.user === 'string') {
      return review.user;
    }
    return review.user?.username || 'Пользователь';
  };

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h3 className="reviews-title">
          <i className="bi bi-chat-quote me-2"></i>
          Отзывы покупателей
        </h3>
        <div className="reviews-stats">
          <div className="average-rating">
            <span className="rating-value">
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0'
              }
            </span>
            <div className="rating-stars">
              {renderStars(reviews.length > 0 
                ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
                : 0
              )}
            </div>
            <span className="reviews-count">
              {reviews.length} {reviews.length === 1 ? 'отзыв' : 
               reviews.length > 1 && reviews.length < 5 ? 'отзыва' : 'отзывов'}
            </span>
          </div>
        </div>
      </div>

      {/* Форма добавления отзыва */}
      <div className="review-form-container">
        <h4 className="form-title">Оставить отзыв</h4>
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Ваша оценка:</label>
            <div className="stars-container">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi bi-star${
                    hoveredStar >= index + 1 || rating >= index + 1 ? '-fill' : ''
                  }`}
                  onMouseEnter={() => setHoveredStar(index + 1)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(index + 1)}
                  style={{ 
                    cursor: 'pointer',
                    color: hoveredStar >= index + 1 || rating >= index + 1 ? '#ffc107' : '#ccc'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="comment-input">
            <label htmlFor="comment">Ваш отзыв:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь своими впечатлениями о товаре..."
              required
              minLength={10}
              maxLength={1000}
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Отправка...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Отправить отзыв
              </>
            )}
          </button>
        </form>
      </div>

      {/* Список отзывов */}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    {getUserInitial(review)}
                  </div>
                  <div className="reviewer-details">
                    <h5 className="reviewer-name">{getUsername(review)}</h5>
                    <span className="review-date">{formatDate(review.created || review.created_at)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-content">
                <p>{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <i className="bi bi-chat-left-dots"></i>
            <p>Пока нет отзывов</p>
            <span>Будьте первым, кто оставит отзыв об этом товаре!</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection; 