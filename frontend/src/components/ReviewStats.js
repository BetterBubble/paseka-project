/**
 * Компонент статистики отзывов.
 * Отображает среднюю оценку и количество отзывов.
 * 
 * @component
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StarRating } from './ReviewSection';

const ReviewStats = memo(({ reviews }) => {
  const { averageRating, totalReviews } = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / total
      : 0;
    return {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: total
    };
  }, [reviews]);

  return (
    <div className="reviews-stats">
      <div className="average-rating">
        <span className="rating-value">{averageRating}</span>
        <div className="rating-stars">
          <StarRating rating={averageRating} />
        </div>
      </div>
      <div className="reviews-count">
        {totalReviews} {totalReviews === 1 ? 'отзыв' : 
          totalReviews > 1 && totalReviews < 5 ? 'отзыва' : 'отзывов'}
      </div>
    </div>
  );
});

ReviewStats.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired
    })
  ).isRequired
};

ReviewStats.displayName = 'ReviewStats';

export default ReviewStats; 