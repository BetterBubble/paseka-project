import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isVisible, setIsVisible] = useState(false);

  // Refs для анимаций
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Анимации при скролле
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const refs = [heroRef, statsRef, productsRef];
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Загружаем категории
      const categoriesResponse = await api.get('/categories/');
      const categoriesData = categoriesResponse.data.results || categoriesResponse.data;
      
      // Загружаем все товары (с учетом пагинации)
      let allProducts = [];
      let nextUrl = '/products/';
      
      while (nextUrl) {
        const productsResponse = await api.get(nextUrl);
        const data = productsResponse.data;
        
        if (data.results) {
          allProducts = [...allProducts, ...data.results];
          // Получаем следующую страницу из URL
          nextUrl = data.next ? data.next.replace('http://localhost:8000/api', '') : null;
        } else {
          // Если нет пагинации, просто добавляем все данные
          allProducts = data;
          nextUrl = null;
        }
      }
      
      setProducts(allProducts);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  // Сортировка и фильтрация товаров
  const getSortedAndFilteredProducts = () => {
    if (!products || products.length === 0) {
      return [];
    }
    
    let filtered = [...products];
    
    // Фильтрация по категории
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => {
        return product.category?.slug === filterCategory;
      });
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const getCategoryIcon = (categoryId) => {
    const categoryMap = {
      'category-1': '🍯',
      'category-2': '⬡',
      'category-3': '🛡️',
      'category-4': '🌸',
      'category-5': '🕯️'
    };
    return categoryMap[categoryId] || '📦';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.slug === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  const filteredProducts = getSortedAndFilteredProducts();
  const totalProducts = products.length;
  const categoryStats = categories.map(category => ({
    ...category,
    count: products.filter(product => product.category?.slug === category.slug).length
  }));

  if (loading) {
    return (
      <div className="category-loading">
        <div className="loading-container">
          <div className="honey-spinner">
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
          </div>
          <p className="loading-text">Загружаем все товары...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-modern all-products-page">
      {/* Hero секция */}
      <section 
        ref={heroRef}
        className="category-hero-modern"
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 25%, #ff8c00 50%, #daa520 75%, #b8860b 100%)'
        }}
      >
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
        
        <div className="container">
          <div className="hero-content-category">
            <div className="category-icon-large">🛒</div>
            <h1 className="category-title">Все товары</h1>
            <p className="category-subtitle">
              Полный ассортимент продукции нашей пасеки - мёд, соты, прополис, пыльца и воск
            </p>
            
            <nav className="category-breadcrumb">
              <Link to="/" className="breadcrumb-link">Главная</Link>
              <span className="breadcrumb-separator">→</span>
              <span className="breadcrumb-current">Все товары</span>
            </nav>

            <div className="category-stats">
              <div className="stat-item">
                <span className="stat-number">{totalProducts}</span>
                <span className="stat-label">Всего товаров</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length}</span>
                <span className="stat-label">Категорий</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Натуральность</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика по категориям */}
      <section ref={statsRef} className="py-5 category-stats-section" style={{background: 'linear-gradient(90deg, #fffbe6 0%, #fff9e6 100%)'}}>
        <div className="container">
          <div className="row mb-4">
            <div className="col text-center">
              <h3 className="text-honey fw-bold mb-2" style={{fontSize:'2rem'}}>Наши категории</h3>
              <p className="text-muted">Распределение товаров по категориям</p>
            </div>
          </div>
          <div className="row g-4">
            {categoryStats.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-4">
                <Link to={`/category/${category.slug}`} className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm" style={{
                    background: 'linear-gradient(135deg, #fff8dc 0%, #ffe4b5 100%)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div className="card-body text-center p-4">
                      <div className="mb-3" style={{fontSize: '3rem'}}>
                        {getCategoryIcon(category.slug)}
                      </div>
                      <h5 className="card-title text-honey fw-bold mb-2">{category.name}</h5>
                      <p className="card-text text-muted mb-3">{category.count} товаров</p>
                      <div className="progress" style={{height: '6px'}}>
                        <div 
                          className="progress-bar" 
                          style={{
                            width: `${(category.count / totalProducts) * 100}%`,
                            background: 'linear-gradient(90deg, #ffc107, #ff8c00)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фильтры и сортировка */}
      <section className="category-filters">
        <div className="container">
          <div className="filters-container">
            <div className="filters-left">
              <h2 className="filters-title">Фильтры и сортировка</h2>
            </div>
            
            <div className="filters-right">
              <div className="filters-row">
                <div className="filter-group">
                  <label htmlFor="category-filter">Категория:</label>
                  <select 
                    id="category-filter"
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Все категории</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Сортировка:</label>
                  <select 
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">По названию</option>
                    <option value="price_asc">Цена: по возрастанию</option>
                    <option value="price_desc">Цена: по убыванию</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Товары */}
      <section ref={productsRef} className="category-products">
        <div className="container">
          <div className="products-header">
            <h2 className="products-title">
              {filterCategory === 'all' ? 'Все товары' : `${getCategoryName(filterCategory)}`}
            </h2>
            <p className="products-count">Найдено товаров: {filteredProducts.length}</p>
            <p className="products-description">
              {filterCategory === 'all' 
                ? 'Весь ассортимент натуральных продуктов пчеловодства от нашей пасеки'
                : `Товары категории "${getCategoryName(filterCategory)}"`
              }
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, index) => {
                return (
                  <div 
                    key={product.id} 
                    className="product-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-category">
              <div className="empty-icon">📦</div>
              <h3 className="empty-title">Товары не найдены</h3>
              <p className="empty-description">
                Попробуйте изменить фильтры или выберите другую категорию
              </p>
              <Link to="/" className="empty-button">
                Вернуться на главную
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Информационная секция */}
      <section className="category-info-modern">
        <div className="container">
          <div className="info-header">
            <h2 className="info-title">Почему выбирают нашу продукцию?</h2>
            <p className="info-subtitle">
              Мы предлагаем полный спектр натуральных продуктов пчеловодства высочайшего качества
            </p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">🏆</div>
                <h3 className="card-title">Премиум качество</h3>
              </div>
              <div className="card-content">
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Собственная пасека в экологически чистом районе
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Сертифицированное качество с лабораторными анализами
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Без добавления сахара и искусственных компонентов
                  </li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">🚚</div>
                <h3 className="card-title">Быстрая доставка</h3>
              </div>
              <div className="card-content">
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Доставка по всей России в течение 1-3 дней
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Специальная упаковка для сохранения свойств
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Бесплатная доставка при заказе от 2000 ₽
                  </li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">💰</div>
                <h3 className="card-title">Выгодные цены</h3>
              </div>
              <div className="card-content">
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Прямые поставки от производителя
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Скидки при покупке нескольких товаров
                  </li>
                  <li className="benefit-item">
                    <i className="bi bi-check-circle-fill"></i>
                    Программа лояльности для постоянных клиентов
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="category-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Готовы попробовать наши продукты?</h2>
              <p className="cta-description">
                Закажите любой товар из нашего ассортимента и убедитесь в качестве сами!
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/cart" className="cta-button primary">
                Перейти в корзину
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProducts; 