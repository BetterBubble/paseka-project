import React, { useState, useEffect, useRef } from 'react';
import { getStaticImageUrl, STATIC_IMAGES } from '../utils/images';

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    experience: 0,
    clients: 0,
    hives: 0,
    products: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const observerRef = useRef();
  const statsRef = useRef();

  // Intersection Observer для анимаций при скролле
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Наблюдаем за всеми секциями
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Анимация счетчиков
  useEffect(() => {
    if (isVisible.stats && !hasAnimated) {
      setHasAnimated(true);
      
      const animateCounter = (target, key, duration = 2000) => {
        const start = 0;
        const startTime = Date.now();
        
        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(start + (target - start) * progress);
          
          setCounters(prev => ({ ...prev, [key]: current }));
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };
        
        requestAnimationFrame(updateCounter);
      };

      animateCounter(15, 'experience');
      animateCounter(500, 'clients');
      animateCounter(100, 'hives');
      animateCounter(50, 'products');
    }
  }, [isVisible.stats, hasAnimated]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="about-page-modern">
      {/* Hero Section с параллакс эффектом */}
      <section className="about-hero-modern">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src={getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY)} 
            alt="Пасека" 
            className="hero-bg-image"
          />
        </div>
        
        <div className="hero-content-modern">
          <div className="hero-text-container">
            <h1 className="hero-title-modern">
              <span className="title-line">Пасека</span>
              <span className="title-line title-accent">Бабла</span>
            </h1>
            <p className="hero-subtitle-modern">
              Где традиции встречаются с инновациями
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🍯</span>
                <span>100% натуральный мед</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌿</span>
                <span>Экологически чистые продукты</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>15+ лет опыта</span>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('story')}
              className="hero-cta-modern"
            >
              <span>Узнать нашу историю</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Статистика с анимированными счетчиками */}
      <section 
        id="stats" 
        ref={statsRef}
        className={`stats-section-modern ${isVisible.stats ? 'animate-in' : ''}`}
        data-animate
      >
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-number">{counters.experience}+</div>
              <div className="stat-label">Лет опыта</div>
              <div className="stat-description">в пчеловодстве</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{counters.clients}+</div>
              <div className="stat-label">Довольных клиентов</div>
              <div className="stat-description">по всей стране</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-number">{counters.hives}+</div>
              <div className="stat-label">Активных ульев</div>
              <div className="stat-description">на наших пасеках</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🍯</div>
              <div className="stat-number">{counters.products}+</div>
              <div className="stat-label">Видов продукции</div>
              <div className="stat-description">высшего качества</div>
            </div>
          </div>
        </div>
      </section>

      {/* История компании */}
      <section 
        id="story" 
        className={`story-section-modern ${isVisible.story ? 'animate-in' : ''}`}
        data-animate
      >
        <div className="story-container">
          <div className="story-content">
            <div className="story-text">
              <div className="section-badge">Наша история</div>
              <h2 className="story-title">
                От маленькой мечты к большому делу
              </h2>
              <div className="story-timeline">
                <div className="timeline-item">
                  <div className="timeline-year">2008</div>
                  <div className="timeline-content">
                    <h4>Начало пути</h4>
                    <p>Всё началось с небольшой пасеки в экологически чистом районе и большой любви к пчеловодству.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2015</div>
                  <div className="timeline-content">
                    <h4>Расширение производства</h4>
                    <p>Увеличили количество ульев до 50 и начали производить разнообразные продукты пчеловодства.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2020</div>
                  <div className="timeline-content">
                    <h4>Современные технологии</h4>
                    <p>Внедрили современные методы производства, сохранив традиционные подходы к качеству.</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-year">2024</div>
                  <div className="timeline-content">
                    <h4>Лидеры рынка</h4>
                    <p>Сегодня мы - одни из ведущих производителей натуральных продуктов пчеловодства.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="story-visual">
              <div className="story-image-container">
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.ABOUT_MAIN)} 
                  alt="Наша пасека" 
                  className="story-image"
                />
                <div className="image-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section 
        id="features" 
        className={`features-section-modern ${isVisible.features ? 'animate-in' : ''}`}
        data-animate
      >
        <div className="features-container">
          <div className="section-header">
            <div className="section-badge">Наши преимущества</div>
            <h2 className="section-title">Почему выбирают именно нас</h2>
            <p className="section-subtitle">
              Мы объединяем традиционные методы пчеловодства с современными стандартами качества
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon-emoji">🌿</span>
              </div>
              <h3>100% Натуральность</h3>
              <p>Никаких искусственных добавок, консервантов или красителей. Только чистые продукты природы.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon-emoji">🏆</span>
              </div>
              <h3>Премиум качество</h3>
              <p>Строгий контроль качества на всех этапах производства и сертификация по международным стандартам.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon-emoji">🚀</span>
              </div>
              <h3>Быстрая доставка</h3>
              <p>Доставляем свежие продукты по всей стране в кратчайшие сроки с сохранением всех полезных свойств.</p>
              <div className="feature-arrow">→</div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon-bg"></div>
                <span className="feature-icon-emoji">💝</span>
              </div>
              <h3>С заботой о вас</h3>
              <p>Каждый продукт создается с любовью и заботой о здоровье наших клиентов и их семей.</p>
              <div className="feature-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Команда */}
      <section 
        id="team" 
        className={`team-section-modern ${isVisible.team ? 'animate-in' : ''}`}
        data-animate
      >
        <div className="team-container">
          <div className="section-header">
            <div className="section-badge">Наша команда</div>
            <h2 className="section-title">Люди, которые создают качество</h2>
            <p className="section-subtitle">
              Профессионалы с многолетним опытом, объединенные общей страстью к пчеловодству
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image-container">
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.TEAM_1)} 
                  alt="Александр"
                  className="team-image"
                />
                <div className="team-overlay">
                  <div className="team-social">
                    <span>Главный пчеловод</span>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3>Александр Петров</h3>
                <p>15+ лет в пчеловодстве</p>
                <div className="team-skills">
                  <span>Пчеловодство</span>
                  <span>Качество</span>
                </div>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-image-container">
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.TEAM_2)} 
                  alt="Мария"
                  className="team-image"
                />
                <div className="team-overlay">
                  <div className="team-social">
                    <span>Контроль качества</span>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3>Мария Иванова</h3>
                <p>Специалист по качеству</p>
                <div className="team-skills">
                  <span>Контроль</span>
                  <span>Анализ</span>
                </div>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-image-container">
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.TEAM_3)} 
                  alt="Дмитрий"
                  className="team-image"
                />
                <div className="team-overlay">
                  <div className="team-social">
                    <span>Менеджер продаж</span>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3>Дмитрий Сидоров</h3>
                <p>Менеджер по продажам</p>
                <div className="team-skills">
                  <span>Продажи</span>
                  <span>Клиенты</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="cta-section-modern">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-icon">🍯</div>
            <h2>Попробуйте настоящий мед уже сегодня!</h2>
            <p>Откройте для себя вкус натуральных продуктов пчеловодства от лучших мастеров своего дела</p>
            <div className="cta-buttons">
              <button 
                onClick={() => window.location.href = '/'}
                className="cta-primary"
              >
                Перейти в каталог
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="cta-secondary">
                Связаться с нами
              </button>
            </div>
          </div>
          
          <div className="cta-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-dots"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 