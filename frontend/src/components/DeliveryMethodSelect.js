/**
 * Компонент выбора способа доставки.
 * Отображает выпадающий список с доступными методами доставки.
 * 
 * @component
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const DeliveryMethodSelect = memo(({ 
  value, 
  onChange, 
  methods,
  className = 'form-control',
  disabled = false
}) => (
  <div className="order-modal-field">
    <label>Способ доставки</label>
    <select
      value={value}
      onChange={onChange}
      required
      className={className}
      disabled={disabled}
    >
      <option value="" disabled>Выберите способ доставки</option>
      {methods.map(method => (
        <option key={method.id} value={method.id}>
          {method.name} {method.cost_policy ? `(${method.cost_policy})` : ''}
        </option>
      ))}
    </select>
  </div>
));

DeliveryMethodSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  methods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      cost_policy: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

DeliveryMethodSelect.displayName = 'DeliveryMethodSelect';

export default DeliveryMethodSelect; 