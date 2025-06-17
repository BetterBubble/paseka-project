import React, { useState, useEffect } from 'react';
import './OrderModal.css';

const OrderModal = ({ isOpen, onClose, onSubmit, totalPrice }) => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      console.log('OrderModal: загружаем способы доставки...');
      fetch('/api/delivery-methods/')
        .then(res => {
          console.log('OrderModal: получен ответ от API:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('OrderModal: данные от API:', data);
          if (Array.isArray(data)) {
            console.log('OrderModal: данные - массив, устанавливаем:', data);
            setDeliveryMethods(data);
          } else if (Array.isArray(data.results)) {
            console.log('OrderModal: данные.results - массив, устанавливаем:', data.results);
            setDeliveryMethods(data.results);
          } else {
            console.log('OrderModal: данные не в ожидаемом формате, устанавливаем пустой массив');
            setDeliveryMethods([]);
          }
        })
        .catch(error => {
          console.error('OrderModal: ошибка загрузки способов доставки:', error);
          setDeliveryMethods([]);
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ fullName, address, deliveryMethod });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFullName('');
        setAddress('');
        setDeliveryMethod('');
      }, 2000);
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при оформлении заказа. Попробуйте еще раз.';
      setError(errorMessage);
      console.error('Ошибка в OrderModal:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay animate__animated animate__fadeIn">
      <div className="order-modal animate__animated animate__zoomIn">
        {success ? (
          <div className="order-modal-success animate__animated animate__fadeInDown">
            <div className="order-modal-success-icon">🎉</div>
            <h3>Заказ успешно оформлен!</h3>
            <p>Спасибо за ваш выбор! Мы уже готовим ваш заказ.</p>
          </div>
        ) : (
          <form className="order-modal-form" onSubmit={handleSubmit}>
            <h2 className="order-modal-title">Оформление заказа</h2>
            <p className="order-modal-info">Доставка займет <b>от 2 до 4 дней</b>. Мы заботимся о качестве и скорости!</p>
            <div className="order-modal-field">
              <label>ФИО</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Введите ваше полное имя"
                className="form-control"
              />
            </div>
            <div className="order-modal-field">
              <label>Адрес доставки</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Город, улица, дом, квартира"
                className="form-control"
              />
            </div>
            <div className="order-modal-field">
              <label>Способ доставки</label>
              <select
                value={deliveryMethod}
                onChange={e => setDeliveryMethod(e.target.value)}
                required
                className="form-control"
              >
                <option value="" disabled>Выберите способ доставки</option>
                {(() => {
                  console.log('OrderModal: рендерим опции, deliveryMethods:', deliveryMethods);
                  return deliveryMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name} {method.cost_policy ? `(${method.cost_policy})` : ''}
                    </option>
                  ));
                })()}
              </select>
            </div>
            <div className="order-modal-message animate__animated animate__pulse animate__infinite">
              <span>✨ Пусть ваш день будет сладким, как наш мёд! ✨</span>
            </div>
            {error && <div className="order-modal-error">{error}</div>}
            <button
              type="submit"
              className="order-modal-pay-btn"
              disabled={loading}
            >
              {loading ? 'Обработка...' : `Оплатить ${totalPrice} ₽`}
            </button>
            <button type="button" className="order-modal-close-btn" onClick={onClose} disabled={loading}>
              Отмена
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderModal; 