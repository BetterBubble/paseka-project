import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [removedItems, setRemovedItems] = useState(new Set());
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      // Пересчитываем общую стоимость при изменении количества или удалении товаров
      const total = order.items
        .filter(item => !removedItems.has(item.id))
        .reduce((sum, item) => {
          const quantity = editMode ? (editedQuantities[item.id] || 0) : item.quantity;
          return sum + (parseFloat(item.product_price) * quantity);
        }, 0);
      setCurrentTotal(total);
    }
  }, [order, editedQuantities, removedItems, editMode]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}/`);
      const orderData = response.data;
      
      // Фильтруем товары, исключая ранее удаленные
      orderData.items = orderData.items.filter(item => !removedItems.has(item.id));
      
      setOrder(orderData);
      const quantities = {};
      orderData.items.forEach(item => {
        quantities[item.id] = item.quantity;
      });
      setEditedQuantities(quantities);
      setCurrentTotal(parseFloat(orderData.total_cost));
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке заказа');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  const handleQuantityChange = (itemId, value) => {
    const newQuantity = Math.max(0, parseInt(value) || 0);
    setEditedQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
    
    if (newQuantity === 0) {
      setRemovedItems(prev => new Set([...prev, itemId]));
    } else {
      setRemovedItems(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedItems = order.items
        .filter(item => !removedItems.has(item.id) && editedQuantities[item.id] > 0)
        .map(item => ({
          id: item.id,
          quantity: editedQuantities[item.id]
        }));

      const response = await api.patch(`/orders/${orderId}/`, {
        items: updatedItems
      });

      if (response.status === 204) {
        // Заказ был удален (все товары были удалены)
        navigate('/orders');
        return;
      }

      // Обновляем состояние заказа с новыми данными
      setOrder(response.data);
      setEditMode(false);
      // Очищаем список удаленных товаров, так как изменения сохранены
      setRemovedItems(new Set());
    } catch (err) {
      setError('Ошибка при сохранении изменений');
    }
  };

  const handleDeleteItem = (itemId) => {
    setEditedQuantities(prev => ({
      ...prev,
      [itemId]: 0
    }));
    setRemovedItems(prev => new Set([...prev, itemId]));
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    loadOrder();
    setRemovedItems(new Set());
  };

  if (loading) return <div className="loading-spinner">Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div className="error-message">Заказ не найден</div>;

  return (
    <div className="order-detail">
      <div className="container">
        <div className="order-detail-header">
          <div className="order-header-top">
            <div className="order-header-left">
          <button className="btn btn-outline-honey" onClick={() => navigate('/orders')}>
            ← Назад к заказам
          </button>
              <div className="order-title">
          <h1>Заказ #{order.id}</h1>
            <span className={`status-badge status-badge--${order.status}`}>
              {order.status_display}
            </span>
              </div>
          </div>
        </div>

        <div className="order-info">
            <div className="info-item">
              <span className="info-label">Дата заказа</span>
              <span className="info-value">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Способ доставки</span>
              <span className="info-value">{order.delivery_method_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Адрес доставки</span>
              <span className="info-value">{order.address}</span>
            </div>
          </div>
        </div>

        <div className="order-items">
          <div className="order-items-header">
            <h2>Товары в заказе</h2>
            {!editMode && (
              <button 
                className="btn btn-outline-honey"
                onClick={() => setEditMode(true)}
              >
                Редактировать
              </button>
            )}
          </div>

          <div className="order-items-list">
            {order.items
              .filter(item => !removedItems.has(item.id))
              .map((item) => {
                const currentQuantity = editMode ? editedQuantities[item.id] : item.quantity;
                const itemTotal = parseFloat(item.product_price) * currentQuantity;
                
                return (
                  <div 
                    key={item.id} 
                    className={`order-item ${editMode ? 'edit-mode' : ''}`}
                  >
                    <div className="order-item-image">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} />
                      )}
                    </div>
                    <div className="order-item-details">
                      <h3>{item.product_name}</h3>
                      <p className="order-item-price">{formatPrice(item.product_price)} ₽</p>
                    </div>
                    <div className="order-item-quantity">
                      {editMode ? (
                        <div className="quantity-controls">
                          <input
                            type="number"
                            min="0"
                            value={currentQuantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="quantity-input"
                          />
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Удалить товар"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span>Количество: {currentQuantity}</span>
                      )}
                    </div>
                    <div className="order-item-total">
                      Итого: {formatPrice(itemTotal)} ₽
                    </div>
                  </div>
                );
              })}
          </div>

          {editMode && (
            <div className="edit-actions">
              <button 
                className="btn btn-outline-danger"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
              <button 
                className="btn btn-honey"
                onClick={handleSaveChanges}
              >
                Сохранить изменения
              </button>
            </div>
          )}

          <div className="order-total">
            <h3>Итого к оплате: {formatPrice(currentTotal)} ₽</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 