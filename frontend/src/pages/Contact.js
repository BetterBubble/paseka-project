import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/contact/', formData);

      if (response.data.success) {
        // Очищаем форму после успешной отправки
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });

        toast.success('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
      } else {
        throw new Error(response.data.error || 'Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error(error.response?.data?.error || 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #fff8dc 0%, #ffe4b5 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="text-center mb-5 text-honey">Связаться с нами</h1>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <h3 className="text-honey mb-3">Контактная информация</h3>
                <div className="mb-3">
                  <i className="bi bi-telephone-fill text-honey me-2"></i>
                  <strong>Телефон:</strong> +7 (999) 123-45-67
                </div>
                <div className="mb-3">
                  <i className="bi bi-envelope-fill text-honey me-2"></i>
                  <strong>Email:</strong> info@paseka-babla.ru
                </div>
                <div className="mb-3">
                  <i className="bi bi-geo-alt-fill text-honey me-2"></i>
                  <strong>Адрес:</strong> Московская область, Подольский район
                </div>
                <div className="mb-3">
                  <i className="bi bi-clock-fill text-honey me-2"></i>
                  <strong>Время работы:</strong> Пн-Пт 9:00-18:00, Сб-Вс 10:00-16:00
                </div>
              </div>
              
              <div className="col-md-6">
                <h3 className="text-honey mb-3">Напишите нам</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Тема</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Сообщение</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-honey"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Отправка...
                      </>
                    ) : (
                      'Отправить сообщение'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 