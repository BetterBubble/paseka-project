/**
 * Компонент индикатора загрузки.
 * Отображает анимированный спиннер с текстом.
 * 
 * @component
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = memo(({ text = 'Загрузка...' }) => (
  <div className="d-flex align-items-center justify-content-center">
    <div className="spinner-border spinner-border-sm me-2" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
    <span>{text}</span>
  </div>
));

LoadingSpinner.propTypes = {
  text: PropTypes.string
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 