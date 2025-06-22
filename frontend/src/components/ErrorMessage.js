/**
 * Компонент сообщения об ошибке.
 * Отображает сообщение об ошибке в унифицированном стиле.
 * 
 * @component
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = memo(({ message, className = '' }) => {
  if (!message) {
    return null;
  }

  return (
    <div 
      className={`alert alert-danger d-flex align-items-center ${className}`} 
      role="alert"
    >
      <i className="bi bi-exclamation-triangle me-2"></i>
      {message}
    </div>
  );
});

ErrorMessage.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
};

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage; 