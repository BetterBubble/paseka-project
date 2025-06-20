import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { useTranslations } from '../components/LanguageSwitcher';
import api from '../services/api';
import { getStaticImageUrl, STATIC_IMAGES } from '../utils/images';

const Home = () => {
  const { t, language } = useTranslations();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshMessage, setRefreshMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const productsRef = useRef(null);

  const loadProducts = useCallback(async (page = 1) => {
    try {
      const timestamp = new Date().getTime();
      const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const response = await api.get(`/products/?page=${page}${searchQuery}&_=${timestamp}`);
      
      setProducts(response.data.results || []);
      setTotalItems(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / 8)); // 8 - количество элементов на странице
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const loadCategories = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get(`/categories/?_=${timestamp}`);
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
    loadCategories();
  }, [loadProducts, loadCategories, currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем страницу на первую при новом поиске
    await loadProducts(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Прокручиваем к секции с товарами
    if (productsRef.current) {
      const offset = 20; // Отступ от верха секции в пикселях
      const elementPosition = productsRef.current.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">{t.loading}</span>
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
          <h1 className="display-3 fw-bold mb-3 text-honey animate__animated animate__fadeInDown">
            {language === 'ru' ? 'Пасека Bubble' : 'Bubble Apiary'}
          </h1>
          <p className="lead fw-normal text-honey mb-4 animate__animated animate__fadeInUp" style={{fontSize:'1.4rem'}}>
            {language === 'ru' 
              ? 'Натуральный мёд и продукты пчеловодства с заботой о вас' 
              : 'Natural honey and beekeeping products with care for you'
            }
          </p>
          <Link to="/all-products" className="btn btn-honey btn-lg animate__animated animate__pulse animate__infinite" style={{
            backgroundColor: 'var(--honey-color)', 
            color: '#fff', 
            border: 'none',
            fontSize: '1.4rem',
            padding: '1rem 2.5rem',
            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
            transform: 'scale(1.1)',
            transition: 'all 0.3s ease'
          }}>
            {language === 'ru' ? 'Посмотреть товары' : 'View Products'}
          </Link>
        </div>
      </header>

      {/* Заголовок "Наши товары" */}
      <section className="py-4 animate__animated animate__fadeInDown" style={{background:'#fffbe6'}}>
        <div className="container">
          <h2 className="text-center text-honey mb-0 animate__animated animate__fadeInDown">
            {language === 'ru' ? 'Наши товары' : 'Our Products'}
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
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{fontSize:'1.1rem'}}
                />
                <button 
                  type="submit" 
                  className="btn btn-honey"
                  style={{ minWidth: '100px' }}
                >
                  <i className="bi bi-search me-2"></i>
                  {language === 'ru' ? 'Поиск' : 'Search'}
                </button>
              </form>
              {refreshMessage && (
                <div className="alert alert-success mt-3 text-center animate__animated animate__fadeIn" style={{
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem'
                }}>
                  <i className="bi bi-check-circle me-2"></i>
                  {refreshMessage}
                </div>
              )}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  {language === 'ru' 
                    ? 'Данные автоматически обновляются при перезагрузке страницы' 
                    : 'Data is automatically updated when the page is reloaded'
                  }
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Товары */}
      <section ref={productsRef} className="py-5 animate__animated animate__fadeInUp" style={{background:'#fffbe6'}}>
        <div className="container">
          {searchTerm && (
            <h3 className="text-center text-honey mb-5 animate__animated animate__fadeInDown">
              {language === 'ru' 
                ? `Результаты поиска: "${searchTerm}" (${totalItems})` 
                : `Search results: "${searchTerm}" (${totalItems})`
              }
            </h3>
          )}
          {products.length === 0 ? (
            <div className="text-center animate__animated animate__fadeIn">
              <p className="text-muted">{t.noProductsFound}</p>
              {searchTerm && (
                <button 
                  className="btn btn-outline-honey"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                    loadProducts(1);
                  }}
                >
                  {language === 'ru' ? 'Показать все товары' : 'Show all products'}
                </button>
              )}
            </div>
          ) : (
            <>
            <div className="row g-4">
              {products.map((product, idx) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 animate__animated animate__fadeInUp" style={{animationDelay: `${0.05 * idx}s`}}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="py-5 animate__animated animate__fadeInUp" style={{background:'linear-gradient(90deg, #fffbe6 0%, #fff9e6 100%)'}}>
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <h2 className="text-honey fw-bold mb-3" style={{fontSize:'2.1rem'}}>
                {language === 'ru' ? 'Почему выбирают нас?' : 'Why choose us?'}
              </h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-droplet-half text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">
                  {language === 'ru' ? '100% Натурально' : '100% Natural'}
                </h5>
                <p className="text-muted mb-0">
                  {language === 'ru' 
                    ? 'Только свежий и чистый мёд, без добавок и сахара.' 
                    : 'Only fresh and pure honey, without additives and sugar.'
                  }
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-flower1 text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">
                  {language === 'ru' ? 'Собственное производство' : 'Own production'}
                </h5>
                <p className="text-muted mb-0">
                  {language === 'ru' 
                    ? 'Всё производится на нашей семейной пасеке с любовью.' 
                    : 'Everything is produced on our family apiary with love.'
                  }
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 advantage-card animate__animated animate__fadeInUp" style={{transition:'box-shadow 0.3s',border:'1.5px solid #ffe4b5'}}>
                <div className="mb-3"><i className="bi bi-shield-check text-honey" style={{fontSize:'2.5rem'}}></i></div>
                <h5 className="fw-bold mb-2">
                  {language === 'ru' ? 'Гарантия качества' : 'Quality guarantee'}
                </h5>
                <p className="text-muted mb-0">
                  {language === 'ru' 
                    ? 'Контроль качества на каждом этапе, сертификаты и честность.' 
                    : 'Quality control at every stage, certificates and honesty.'
                  }
                </p>
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
              <h3 className="text-honey fw-bold mb-2" style={{fontSize:'2.2rem'}}>
                {language === 'ru' ? 'Наши Категории' : 'Our Categories'}
              </h3>
              <p className="text-muted" style={{fontSize:'1.1rem'}}>
                {language === 'ru' 
                  ? 'Выберите категорию продуктов пчеловодства' 
                  : 'Choose a beekeeping product category'
                }
              </p>
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
                      <small className="text-muted category-description">
                        {language === 'ru' ? 'Натуральные продукты' : 'Natural products'}
                      </small>
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
                      {language === 'ru' 
                        ? 'Все продукты сертифицированы и проходят строгий контроль качества'
                        : 'All products are certified and undergo strict quality control'
                      }
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