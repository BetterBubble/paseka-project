import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="text-honey mb-3">
              <i className="bi bi-flower1 me-2"></i>
              Пасека Бабла
            </h5>
            <p className="text-muted">
              Натуральные продукты пчеловодства высочайшего качества. 
              Мёд, прополис, пыльца и другие полезные продукты прямо с пасеки.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-dark mb-3">Навигация</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Главная</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none">О нас</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">Контакты</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-dark mb-3">Контакты</h6>
            <ul className="list-unstyled text-muted">
              <li><i className="bi bi-telephone me-2"></i>+7 (999) 123-45-67</li>
              <li><i className="bi bi-envelope me-2"></i>info@paseka-babla.ru</li>
              <li><i className="bi bi-geo-alt me-2"></i>Москва, Россия</li>
            </ul>
          </div>
          
          <div className="col-lg-3 mb-4">
            <h6 className="text-dark mb-3">Социальные сети</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted fs-4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-muted fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-muted fs-4"><i className="bi bi-telegram"></i></a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              © 2024 Пасека Бабла. Все права защищены.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">
              Сделано с <i className="bi bi-heart-fill text-danger"></i> для любителей мёда
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 