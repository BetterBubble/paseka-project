import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { getStaticImageUrl, STATIC_IMAGES } from '../utils/images';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/')
      ]);
      
      setProducts(productsResponse.data.results || productsResponse.data);
      setCategories(categoriesResponse.data.results || categoriesResponse.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    try {
      const response = await api.get(`/products/?search=${encodeURIComponent(searchTerm)}`);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero секция с анимацией */}
      <header 
        className="hero-section position-relative overflow-hidden d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url("${getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '480px',
          borderRadius: '0 0 2.5rem 2.5rem',
          boxShadow: '0 8px 32px rgba(210, 105, 30, 0.08)',
          animation: 'fadeInDown 1.2s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <div className="container px-4 px-lg-5 text-center" style={{zIndex:2}}>
          <h1 className="display-3 fw-bold mb-3 text-honey animate__animated animate__fadeInDown">Пасека Бабла</h1>
          <p className="lead fw-normal text-honey mb-4 animate__animated animate__fadeInUp" style={{fontSize:'1.4rem'}}>Натуральный мёд и продукты пчеловодства с заботой о вас</p>
          <Link to="/all-products" className="btn btn-honey btn-lg animate__animated animate__pulse animate__infinite" style={{
            backgroundColor: 'var(--honey-color)', 
            color: '#fff', 
            border: 'none',
            fontSize: '1.4rem',
            padding: '1rem 2.5rem',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
            transform: 'scale(1.1)',
            transition: 'all 0.3s ease'
          }}>Посмотреть товары</Link>
        </div>
      </header>

      {/* Заголовок "Наши товары" */}
      <section className="py-4 animate__animated animate__fadeInDown" style={{background:'#fffbe6'}}>
        <div className="container">
          <h2 className="text-center text-honey mb-0 animate__animated animate__fadeInDown">
            Наши товары
          </h2>
        </div>
      </section>

      {/* Поиск */}
      <section className="py-4 animate__animated animate__fadeIn" style={{background:'#fffbe6'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <form onSubmit={handleSearch} className="d-flex shadow-sm rounded-4 overflow-hidden bg-white animate__animated animate__fadeIn" style={{border:'1.5px solid #ffe4b5'}}>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent px-4 py-3"
                  placeholder="Поиск товаров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{fontSize:'1.1rem'}}
                />
                <button type="submit" className="btn btn-honey px-4" style={{borderRadius:0}}>
                  <i className="bi bi-search" style={{fontSize: '1.1rem'}}></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Товары */}
      <section className="py-5 animate__animated animate__fadeInUp" style={{background:'#fffbe6'}}>
        <div className="container">
          {searchTerm && (
            <h3 className="text-center text-honey mb-5 animate__animated animate__fadeInDown">
              Результаты поиска: "{searchTerm}"
            </h3>
          )}
          {products.length === 0 ? (
            <div className="text-center animate__animated animate__fadeIn">
              <p className="text-muted">Товары не найдены</p>
              {searchTerm && (
                <button 
                  className="btn btn-outline-honey"
                  onClick={() => {
                    setSearchTerm('');
                    loadData();
                  }}
                >
                  Показать все товары
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product, idx) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 animate__animated animate__fadeInUp" style={{animationDelay: `${0.05 * idx}s`}}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="py-5 animate__animated animate__fadeInUp" style={{background:'linear-gradient(90deg, #fffbe6 0%, #fff9e6 100%)'}}>
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <h2 className="text-honey fw-bold mb-3" style={{fontSize:'2.1rem'}}>Почему выбирают нас?</h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-droplet-half text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">100% Натурально</h5>
                <p className="text-muted mb-0">Только свежий и чистый мёд, без добавок и сахара.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-flower1 text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">Собственное производство</h5>
                <p className="text-muted mb-0">Всё производится на нашей семейной пасеке с любовью.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-shield-check text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">Гарантия качества</h5>
                <p className="text-muted mb-0">Контроль качества на каждом этапе, сертификаты и честность.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="py-5 animate__animated animate__fadeInUp" style={{background:'linear-gradient(90deg, #fffbe6 0%, #fff9e6 100%)'}}>
        <div className="container">
          <div className="row mb-5">
            <div className="col text-center">
              <h3 className="text-honey fw-bold mb-2" style={{fontSize:'2.2rem'}}>Наши Категории</h3>
              <p className="text-muted" style={{fontSize:'1.1rem'}}>Выберите категорию продуктов пчеловодства</p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {categories.map((cat, idx) => {
              let icon = 'bi-tag';
              let categoryClass = '';
              
              if (cat.slug?.includes('med') || cat.name?.toLowerCase().includes('мёд')) {
                icon = 'bi-droplet-fill';
                categoryClass = 'category-honey';
              } else if (cat.slug?.includes('sot') || cat.name?.toLowerCase().includes('соты')) {
                icon = 'bi-hexagon-fill';
                categoryClass = 'category-comb';
              } else if (cat.slug?.includes('propolis') || cat.name?.toLowerCase().includes('прополис')) {
                icon = 'bi-shield-fill';
                categoryClass = 'category-propolis';
              } else if (cat.slug?.includes('pyl') || cat.name?.toLowerCase().includes('пыльца')) {
                icon = 'bi-flower1';
                categoryClass = 'category-pollen';
              } else if (cat.slug?.includes('vosk') || cat.name?.toLowerCase().includes('воск')) {
                icon = 'bi-square-fill';
                categoryClass = 'category-wax';
              }
              
              return (
                <div key={cat.id} className="col-lg-2 col-md-3 col-6">
                  <Link 
                    to={`/category/${cat.slug}`} 
                    className={`d-block text-decoration-none category-card ${categoryClass} shadow-sm p-4 text-center animate__animated animate__zoomIn`}
                    style={{
                      background:'#fff',
                      borderRadius:'1.5rem',
                      border:'2px solid #ffe4b5',
                      minHeight: 140,
                      animationDelay: `${idx * 0.1}s`
                    }}
                  >
                    <div className="category-icon-container mb-3 d-flex justify-content-center align-items-center" style={{minHeight:'3rem'}}>
                      <i className={`bi ${icon} text-honey category-icon`} style={{fontSize:'3rem',display:'block'}}></i>
                    </div>
                    <div className="category-text">
                      <span className="fw-bold text-honey d-block category-name" style={{fontSize:'1.2rem'}}>{cat.name}</span>
                      <small className="text-muted category-description">Натуральные продукты</small>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          
          {/* Дополнительная информация под категориями */}
          <div className="row mt-5">
            <div className="col text-center">
              <div className="p-4 bg-white rounded-4 shadow-sm" style={{border:'1px solid #ffe4b5'}}>
                <div className="row g-3 align-items-center justify-content-center">
                  <div className="col-auto">
                    <i className="bi bi-award text-honey" style={{fontSize:'2rem'}}></i>
                  </div>
                  <div className="col-auto">
                    <span className="fw-bold text-honey" style={{fontSize:'1.1rem'}}>
                      Все продукты сертифицированы и проходят строгий контроль качества
                    </span>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-check-circle text-success" style={{fontSize:'1.5rem'}}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 