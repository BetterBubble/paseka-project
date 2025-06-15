import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ showLogin, showRegister, onClose }) => {
  const { login, register } = useAuth();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Функция для очистки всех состояний при закрытии
  const handleClose = () => {
    setLoginError('');
    setRegisterError('');
    setLoginSuccess('');
    setRegisterSuccess('');
    setLoading(false);
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const result = await login(loginData.username, loginData.password);
      if (result.success) {
        setLoginSuccess('Вход выполнен успешно!');
        setLoginData({ username: '', password: '' });
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setLoginError(result.error || 'Ошибка входа');
      }
    } catch (error) {
      setLoginError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError('');
    setRegisterSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const result = await register(registerData.username, registerData.email, registerData.password);
      if (result.success) {
        setRegisterSuccess(result.message || 'Регистрация прошла успешно!');
        setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setRegisterError(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setRegisterError('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибки при изменении полей
    if (loginError) setLoginError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибки при изменении полей
    if (registerError) {
      setRegisterError('');
    }
  };

  const switchToRegister = () => {
    setLoginError('');
    setLoginSuccess('');
    handleClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openRegisterModal'));
    }, 100);
  };

  const switchToLogin = () => {
    setRegisterError('');
    setRegisterSuccess('');
    handleClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }, 100);
  };

  return (
    <>
      {/* Модальное окно входа */}
      <div className={`modal fade ${showLogin ? 'show d-block' : ''}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Вход в аккаунт
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleLoginSubmit}>
                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {loginError}
                  </div>
                )}
                
                {loginSuccess && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {loginSuccess}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="loginUsername" className="form-label">
                    <i className="bi bi-person me-2"></i>
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="loginUsername"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                    placeholder="Введите имя пользователя"
                    disabled={loading || loginSuccess}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Пароль
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    placeholder="Введите пароль"
                    disabled={loading || loginSuccess}
                  />
                </div>
                
                {!loginSuccess && (
                  <>
                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-honey"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Вход...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Войти
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        Отмена
                      </button>
                    </div>
                    
                    <hr />
                    <div className="text-center">
                      <p className="mb-0">Нет аккаунта?</p>
                      <button 
                        type="button" 
                        className="btn btn-link p-0"
                        onClick={switchToRegister}
                        disabled={loading}
                      >
                        Зарегистрироваться
                      </button>
                    </div>
                  </>
                )}
                
                {/* Подсказка для тестирования */}
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Доступные аккаунты:<br/>
                    • логин <code>bubble</code>, пароль <code>1103</code><br/>
                    • логин <code>Александр</code>, пароль <code>1103</code>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно регистрации */}
      <div className={`modal fade ${showRegister ? 'show d-block' : ''}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-person-plus me-2"></i>
                Регистрация
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegisterSubmit}>
                {registerError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {registerError}
                  </div>
                )}
                
                {registerSuccess && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {registerSuccess}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="registerUsername" className="form-label">
                    <i className="bi bi-person me-2"></i>
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerUsername"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Выберите имя пользователя"
                    minLength="3"
                    disabled={loading || registerSuccess}
                  />
                  <div className="form-text">Минимум 3 символа</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Введите ваш email"
                    disabled={loading || registerSuccess}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Пароль
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Создайте пароль"
                    minLength="6"
                    disabled={loading || registerSuccess}
                  />
                  <div className="form-text">Минимум 6 символов</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="registerConfirmPassword" className="form-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerConfirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Повторите пароль"
                    disabled={loading || registerSuccess}
                  />
                </div>
                
                {!registerSuccess && (
                  <>
                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-honey"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Регистрация...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Зарегистрироваться
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        Отмена
                      </button>
                    </div>
                    
                    <hr />
                    <div className="text-center">
                      <p className="mb-0">Уже есть аккаунт?</p>
                      <button 
                        type="button" 
                        className="btn btn-link p-0"
                        onClick={switchToLogin}
                        disabled={loading}
                      >
                        Войти
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {(showLogin || showRegister) && (
        <div 
          className="modal-backdrop fade show" 
          onClick={handleClose}
        ></div>
      )}
    </>
  );
};

export default AuthModals; 