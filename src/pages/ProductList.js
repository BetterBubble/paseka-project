import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const ProductList = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const productsRef = useRef(null);

  // Intersection Observer для анимаций
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, statsRef.current, productsRef.current].filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Подробная информация о категориях с иконками
  const categoryDetails = {
    'category-1': {
      icon: '🍯',
      color: '#f4a460',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ff8c00 100%)',
      benefits: [
        'Укрепляет иммунную систему и повышает сопротивляемость организма к инфекциям',
        'Содержит более 300 полезных веществ: витамины, минералы, аминокислоты',
        'Обладает антибактериальными и противовоспалительными свойствами',
        'Улучшает пищеварение и нормализует обмен веществ',
        'Повышает энергию и работоспособность естественным путем'
      ],
      usage: [
        'Утром натощак: 1-2 чайные ложки за 30 минут до завтрака',
        'В качестве натурального подсластителя в чае, кофе, выпечке',
        'При простуде: с теплым молоком или травяным чаем',
        'Для косметических масок: смешать с овсянкой или сметаной',
        'Спортсменам: перед тренировкой для быстрого восполнения энергии'
      ],
      whyBuy: [
        'Экологически чистый продукт с наших собственных пасек',
        'Без добавления сахара, консервантов и искусственных добавок',
        'Прямая поставка от пчеловода - гарантия свежести и качества',
        'Сертифицированное качество с лабораторными анализами',
        'Доступная цена без посреднических наценок'
      ]
    },
    'category-2': {
      icon: '⬡',
      color: '#daa520',
      gradient: 'linear-gradient(135deg, #ffcc33 0%, #ff9900 50%, #cc6600 100%)',
      benefits: [
        'Содержат натуральный воск, прополис и пыльцу в концентрированном виде',
        'Укрепляют зубы и десны при жевании, очищают полость рта',
        'Стимулируют выработку слюны и улучшают пищеварение',
        'Богаты ферментами, которые помогают усвоению питательных веществ',
        'Обладают мощным антиоксидантным действием'
      ],
      usage: [
        'Жевать небольшой кусочек (размером с горошину) 10-15 минут',
        'Принимать 2-3 раза в день между приемами пищи',
        'Детям давать под присмотром взрослых, начиная с 3-х лет',
        'При заболеваниях горла: медленно рассасывать во рту',
        'Для профилактики: курсами по 2-3 недели с перерывами'
      ],
      whyBuy: [
        'Уникальный продукт, который невозможно подделать или синтезировать',
        'Максимальная концентрация полезных веществ в натуральном виде',
        'Длительный срок хранения без потери свойств',
        'Экономичность - одной упаковки хватает на месяц регулярного применения',
        'Подходит для всей семьи, включая детей и пожилых людей'
      ]
    },
    'category-3': {
      icon: '🛡️',
      color: '#8b4513',
      gradient: 'linear-gradient(135deg, #daa520 0%, #b8860b 50%, #8b6914 100%)',
      benefits: [
        'Мощное природное антибиотическое и противовирусное средство',
        'Ускоряет заживление ран, ожогов и других повреждений кожи',
        'Укрепляет иммунитет и помогает бороться с инфекциями',
        'Обладает обезболивающим и противовоспалительным действием',
        'Замедляет процессы старения и улучшает состояние кожи'
      ],
      usage: [
        'Внутрь: 20-30 капель настойки 3 раза в день до еды',
        'Наружно: смазывать пораженные участки кожи 2-3 раза в день',
        'Для полоскания: 1 чайная ложка настойки на стакан воды',
        'В косметологии: добавлять в кремы и маски',
        'При простуде: ингаляции с водным раствором прополиса'
      ],
      whyBuy: [
        'Натуральная альтернатива синтетическим антибиотикам',
        'Не вызывает привыкания и побочных эффектов при правильном применении',
        'Универсальное средство для внутреннего и наружного применения',
        'Высокая концентрация активных веществ',
        'Проверенное веками народное средство с научным обоснованием'
      ]
    },
    'category-4': {
      icon: '🌸',
      color: '#ff69b4',
      gradient: 'linear-gradient(135deg, #ffb347 0%, #ffa500 50%, #ff7f00 100%)',
      benefits: [
        'Содержит все незаменимые аминокислоты, необходимые организму',
        'Богата витаминами группы B, витамином C, каротином',
        'Повышает физическую выносливость и умственную активность',
        'Нормализует гормональный фон и улучшает репродуктивную функцию',
        'Замедляет процессы старения и улучшает состояние кожи и волос'
      ],
      usage: [
        'Утром: 1 чайная ложка за 30 минут до завтрака, запивая водой',
        'Спортсменам: 2 чайные ложки перед тренировкой',
        'Детям: по 1/2 чайной ложки 1-2 раза в день',
        'В смузи и коктейлях: добавлять по вкусу',
        'Курс приема: 1-2 месяца с перерывом в 2-3 недели'
      ],
      whyBuy: [
        'Природный источник белка высочайшего качества',
        'Идеально подходит для вегетарианцев и веганов',
        'Быстро усваивается организмом без нагрузки на пищеварение',
        'Собрана в экологически чистых районах вдали от промышленности',
        'Правильная сушка и хранение сохраняют все полезные свойства'
      ]
    },
    'category-5': {
      icon: '🕯️',
      color: '#daa520',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #daa520 50%, #b8860b 100%)',
      benefits: [
        'Обладает антисептическими и заживляющими свойствами',
        'Смягчает и увлажняет кожу, предотвращает сухость',
        'Содержит витамин A и другие полезные для кожи вещества',
        'Создает защитную пленку, предохраняющую от внешних воздействий',
        'Гипоаллергенен и подходит для чувствительной кожи'
      ],
      usage: [
        'В косметологии: основа для кремов, бальзамов, помад',
        'Для лечения: смазывать трещины, ссадины, сухие участки кожи',
        'В быту: полировка мебели, защита кожаных изделий',
        'Для рукоделия: изготовление свечей, восковых фигурок',
        'В народной медицине: компрессы при болях в суставах'
      ],
      whyBuy: [
        'Натуральный продукт без химических добавок и отбеливателей',
        'Универсальное применение в медицине, косметологии и быту',
        'Длительный срок хранения без потери качества',
        'Экономичность - небольшого количества хватает надолго',
        'Традиционное качество, проверенное поколениями пчеловодов'
      ]
    }
  };

  useEffect(() => {
    loadProducts();
    setTimeout(() => setIsVisible(true), 100);
  }, [categorySlug]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get(`/products/?category=${categorySlug}`),
        api.get('/categories/')
      ]);
      
      setProducts(productsResponse.data.results || productsResponse.data);
      
      const categories = categoriesResponse.data.results || categoriesResponse.data;
      const currentCategory = categories.find(cat => cat.slug === categorySlug);
      setCategory(currentCategory);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  // Сортировка товаров
  const getSortedAndFilteredProducts = () => {
    let filtered = [...products];

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="category-loading">
        <div className="loading-container">
          <div className="honey-spinner">
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
            <div className="honey-drop"></div>
          </div>
          <p className="loading-text">Загружаем сладкие товары...</p>
        </div>
      </div>
    );
  }

  const details = categoryDetails[categorySlug];
  const sortedProducts = getSortedAndFilteredProducts();

  return (
    <div className="category-page-modern">
      {/* Hero секция категории */}
      <section 
        ref={heroRef}
        className="category-hero-modern"
        style={{
          background: details?.gradient || 'linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ff8c00 100%)'
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
            <div className="category-icon-large">
              {details?.icon || '📦'}
            </div>
            <h1 className="category-title">
              {category ? category.name : 'Товары'}
            </h1>
            <p className="category-subtitle">
              {category?.description || 'Натуральные продукты пчеловодства высочайшего качества'}
            </p>
            
            {/* Breadcrumb */}
            <nav className="category-breadcrumb">
              <Link to="/" className="breadcrumb-link">
                <i className="bi bi-house-door"></i>
                Главная
              </Link>
              <span className="breadcrumb-separator">
                <i className="bi bi-chevron-right"></i>
              </span>
              <span className="breadcrumb-current">
                {category ? category.name : 'Категория'}
              </span>
            </nav>

            {/* Статистика категории */}
            <div className="category-stats">
              <div className="stat-item">
                <div className="stat-number">{products.length}</div>
                <div className="stat-label">товаров</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">натуральные</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Фильтры и сортировка */}
      <section className="category-filters">
        <div className="container">
          <div className="filters-container">
            <div className="filters-left">
              <h3 className="filters-title">
                <i className="bi bi-funnel"></i>
                Фильтры и сортировка
              </h3>
            </div>
            
            <div className="filters-right">
              <div className="filter-group">
                <label htmlFor="sortBy" className="filter-label">Сортировать по:</label>
                <select 
                  id="sortBy"
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Названию</option>
                  <option value="price_asc">Цене (по возрастанию)</option>
                  <option value="price_desc">Цене (по убыванию)</option>
                  <option value="rating">Рейтингу</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Товары */}
      <section ref={productsRef} className="category-products">
        <div className="container">
          {sortedProducts.length > 0 ? (
            <>
              <div className="products-header">
                <h2 className="products-title">
                  Наши товары
                  <span className="products-count">({sortedProducts.length})</span>
                </h2>
                <div className="products-description">
                  Каждый продукт проходит строгий контроль качества и сертификацию
                </div>
              </div>

              <div className="products-grid">
                {sortedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="product-item"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-category">
              <div className="empty-icon">
                <i className="bi bi-box-seam"></i>
              </div>
              <h3 className="empty-title">В этой категории пока нет товаров</h3>
              <p className="empty-description">
                Мы работаем над пополнением ассортимента. Загляните позже!
              </p>
              <Link to="/" className="empty-button">
                <i className="bi bi-arrow-left"></i>
                Вернуться на главную
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Подробная информация о категории */}
      {details && (
        <section ref={statsRef} className="category-info-modern">
          <div className="container">
            <div className="info-header">
              <h2 className="info-title">
                Почему стоит выбрать {category?.name?.toLowerCase()}?
              </h2>
              <p className="info-subtitle">
                Узнайте больше о пользе и применении наших продуктов
              </p>
            </div>

            <div className="info-grid">
              {/* Польза для здоровья */}
              <div className="info-card benefits-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="bi bi-heart-pulse"></i>
                  </div>
                  <h3 className="card-title">Польза для здоровья</h3>
                </div>
                <div className="card-content">
                  <ul className="benefits-list">
                    {details.benefits.map((benefit, index) => (
                      <li key={index} className="benefit-item">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Как применять */}
              <div className="info-card usage-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="bi bi-clipboard-check"></i>
                  </div>
                  <h3 className="card-title">Как применять</h3>
                </div>
                <div className="card-content">
                  <ul className="usage-list">
                    {details.usage.map((usage, index) => (
                      <li key={index} className="usage-item">
                        <div className="usage-number">{index + 1}</div>
                        <span>{usage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Почему покупать у нас */}
              <div className="info-card why-buy-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h3 className="card-title">Почему покупать у нас</h3>
                </div>
                <div className="card-content">
                  <ul className="why-buy-list">
                    {details.whyBuy.map((reason, index) => (
                      <li key={index} className="why-buy-item">
                        <i className="bi bi-award-fill"></i>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA секция */}
      <section className="category-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Остались вопросы?</h2>
              <p className="cta-description">
                Наши специалисты помогут выбрать подходящий продукт и расскажут о его применении
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="cta-button primary">
                <i className="bi bi-telephone"></i>
                Связаться с нами
              </Link>
              <Link to="/about" className="cta-button secondary">
                <i className="bi bi-info-circle"></i>
                О нашей пасеке
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList; 