import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('OrdersPage: Current user:', user);
    console.log('OrdersPage: Auth token:', token);
    
    if (!user) {
      console.log('OrdersPage: No user, redirecting to home');
      navigate('/');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      console.log('OrdersPage: Starting to load orders...');
      const token = localStorage.getItem('authToken');
      console.log('OrdersPage: Using token:', token);
      
      const response = await api.get('/orders/');
      console.log('OrdersPage: API response:', response);
      console.log('OrdersPage: Orders data:', response.data);
      
      // Убедимся, что response.data является массивом
      const ordersArray = Array.isArray(response.data) ? response.data : 
                         (response.data.results ? response.data.results : []);
      
      console.log('OrdersPage: Processed orders array:', ordersArray);
      setOrders(ordersArray);
      setLoading(false);
    } catch (err) {
      console.error('OrdersPage: Error loading orders:', err);
      console.error('OrdersPage: Error details:', err.response?.data);
      setError('Ошибка при загрузке заказов: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await api.delete(`/orders/${orderId}/`);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        console.error('OrdersPage: Error deleting order:', err);
        setError('Ошибка при удалении заказа: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-badge--pending',
      'processing': 'status-badge--processing',
      'shipped': 'status-badge--shipped',
      'delivered': 'status-badge--delivered',
      'cancelled': 'status-badge--cancelled'
    };
    return `status-badge ${statusClasses[status] || ''}`;
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-spinner">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">Ваши заказы</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>У вас пока нет заказов</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3 className="order-number">Заказ #{order.id}</h3>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p className="order-date">
                    <i className="fas fa-calendar"></i>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="order-total">
                    <i className="fas fa-money-bill"></i>
                    {order.total_cost} ₽
                  </p>
                  <p className="order-items">
                    <i className="fas fa-box"></i>
                    {order.items?.length || 0} товаров
                  </p>
                </div>
                <div className="order-actions">
                  <button
                    className="btn btn-outline-honey"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Подробнее
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 