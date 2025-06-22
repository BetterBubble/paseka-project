/**
 * Компонент списка отзывов.
 * Отображает список отзывов с возможностью сортировки и фильтрации.
 * 
 * @component
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ReviewCard } from './ReviewSection';

const ReviewsList = memo(({ 
  reviews, 
  formatDate, 
  getUserInitial, 
  getUsername 
}) => {
  if (!reviews.length) {
    return (
      <div className="no-reviews">
        <i className="bi bi-chat-square-text"></i>
        <p>Пока нет отзывов</p>
        <span>Будьте первым, кто оставит отзыв об этом товаре!</span>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          formatDate={formatDate}
          getUserInitial={getUserInitial}
          getUsername={getUsername}
        />
      ))}
    </div>
  );
});

ReviewsList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      created: PropTypes.string,
      created_at: PropTypes.string,
      user: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          username: PropTypes.string
        })
      ]).isRequired
    })
  ).isRequired,
  formatDate: PropTypes.func.isRequired,
  getUserInitial: PropTypes.func.isRequired,
  getUsername: PropTypes.func.isRequired
};

ReviewsList.displayName = 'ReviewsList';

export default ReviewsList; 