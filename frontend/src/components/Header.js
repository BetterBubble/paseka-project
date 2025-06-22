import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModals from './AuthModals';
import LanguageSwitcher, { useTranslations } from './LanguageSwitcher';
import api from '../services/api';
import './ProfileDropdown.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { t, language } = useTranslations();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Эффект прокрутки для изменения стиля хедера
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Загрузка категорий
  useEffect(() => {
    loadCategories();
  }, []);

  // Закрытие мобильного меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowCategoriesDropdown(false);
    setShowProfileDropdown(false);
  }, [location]);

  // Обработчики событий для переключения модальных окон
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setAuthMode('login');
      setShowAuthModal(true);
    };

    const handleOpenRegisterModal = () => {
      setAuthMode('register');
      setShowAuthModal(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    window.addEventListener('openRegisterModal', handleOpenRegisterModal);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
      window.removeEventListener('openRegisterModal', handleOpenRegisterModal);
    };
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const cartItemsCount = items ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getCategoryIcon = (category) => {
    const name = category.name?.toLowerCase() || '';
    const slug = category.slug?.toLowerCase() || '';
    
    if (name.includes('мёд') || slug.includes('med')) return '🍯';
    if (name.includes('соты') || slug.includes('sot')) return '⬡';
    if (name.includes('прополис') || slug.includes('propolis')) return '🛡️';
    if (name.includes('пыльца') || slug.includes('pyl')) return '🌸';
    if (name.includes('воск') || slug.includes('vosk')) return '🕯️';
    return '📦';
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar">
            {/* Логотип */}
            <Link to="/" className="navbar-brand">
              <div className="brand-container">
                <div className="brand-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 10.5V19L13.5 17.5V10.5M10.5 10.5V17.5L9 19V10.5M9 9V7.5L3 7V9M12 7.5C11.2 7.5 10.5 8.2 10.5 9V10.5H13.5V9C13.5 8.2 12.8 7.5 12 7.5Z"/>
                  </svg>
                </div>
                <div className="brand-text">
                  <span className="brand-name">Пасека</span>
                  <span className="brand-tagline">
                    {language === 'ru' ? 'Натуральный мёд' : 'Natural Honey'}
                  </span>
                </div>
              </div>
            </Link>

            {/* Навигация */}
            <div 
              className={`navbar-nav ${isMobileMenuOpen ? 'navbar-nav--open' : ''}`}
              data-testid="navbar-nav"
            >
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-link-text">{t.home}</span>
                <div className="nav-link-indicator"></div>
              </Link>

              {/* Категории с выпадающим списком */}
              <div 
                className="nav-dropdown"
                onMouseEnter={() => setShowCategoriesDropdown(true)}
                onMouseLeave={() => setShowCategoriesDropdown(false)}
              >
                <button className="nav-link nav-dropdown-toggle">
                  <span className="nav-link-text">{t.categories}</span>
                  <div className="nav-link-indicator"></div>
                  <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                
                {showCategoriesDropdown && (
                  <div className="nav-dropdown-menu">
                    <Link
                      to="/all-products"
                      className="nav-dropdown-item"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      <span className="category-icon">🛒</span>
                      <span className="category-name">{t.allProducts}</span>
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="nav-dropdown-item"
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        <span className="category-icon">{getCategoryIcon(category)}</span>
                        <span className="category-name">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/about" 
                className={`nav-link ${isActive('/about') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-link-text">{t.about}</span>
                <div className="nav-link-indicator"></div>
              </Link>
              <Link 
                to="/contact" 
                className={`nav-link ${isActive('/contact') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-link-text">{t.contact}</span>
                <div className="nav-link-indicator"></div>
              </Link>
            </div>

            {/* Действия пользователя */}
            <div className="navbar-actions">
              {/* Корзина */}
              <Link to="/cart" className="action-btn cart-btn">
                <div className="cart-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </div>
                <span className="action-text">{t.cart}</span>
              </Link>

              {/* Профиль */}
              {user ? (
                <div 
                  className="profile-dropdown"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                    <div className="user-avatar" data-testid="user-avatar">
                    {user.username ? user.username[0].toUpperCase() : '?'}
                  </div>
                  
                  {showProfileDropdown && (
                    <div className="profile-dropdown-menu show">
                      <div className="profile-dropdown-header">
                        <div className="profile-dropdown-username">
                          {user.username}
                        </div>
                        <div className="profile-dropdown-email">
                          {user.email}
                        </div>
                      </div>

                      <div className="profile-dropdown-content">
                        <Link to="/profile" className="profile-dropdown-item">
                          <i className="fas fa-user"></i>
                          <span>{t.profile}</span>
                        </Link>

                      <Link to="/orders" className="profile-dropdown-item">
                        <i className="fas fa-box"></i>
                          <span>{t.orders}</span>
                        </Link>

                        <Link to="/favorites" className="profile-dropdown-item">
                          <i className="fas fa-heart"></i>
                          <span>{t.favorites}</span>
                        </Link>

                        <div className="profile-dropdown-divider"></div>

                        <Link to="/settings" className="profile-dropdown-item">
                          <i className="fas fa-cog"></i>
                          <span>{t.settings}</span>
                      </Link>

                      <div className="profile-dropdown-divider"></div>

                      <button 
                          className="profile-dropdown-item logout"
                        onClick={handleLogout}
                          aria-label="Выйти из аккаунта"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                          <span>{t.logout}</span>
                  </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons" data-testid="auth-buttons">
                  <button 
                    className="login-btn" 
                    onClick={() => handleAuthClick('login')} 
                  >
                    {t.login}
                  </button>
                  <button 
                    className="register-btn"
                    onClick={() => handleAuthClick('register')} 
                  >
                    {t.register}
                  </button>
                </div>
              )}

              {/* Переключатель языка */}
              <LanguageSwitcher />

              {/* Мобильное меню */}
              <button 
                className="mobile-menu-btn"
                data-testid="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </button>
            </div>
          </nav>
        </div>

        {/* Мобильное меню overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </header>

      {/* Модальные окна аутентификации */}
      <AuthModals 
        showLogin={showAuthModal && authMode === 'login'}
        showRegister={showAuthModal && authMode === 'register'}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header; 