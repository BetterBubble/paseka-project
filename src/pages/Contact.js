import React from 'react';

const Contact = () => {
  return (
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
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Имя</label>
                  <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Тема</label>
                  <input type="text" className="form-control" id="subject" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Сообщение</label>
                  <textarea className="form-control" id="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-honey">
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 