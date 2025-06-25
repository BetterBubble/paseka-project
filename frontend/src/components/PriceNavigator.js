import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslations } from './LanguageSwitcher';

const PriceNavigator = () => {
  const { t, language } = useTranslations();
  const [priceStats, setPriceStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceStats = async () => {
      try {
        const response = await api.get('/price-statistics/');
        setPriceStats(response.data);
      } catch (error) {
        console.error('Error fetching price statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ background: '#fffbe6' }}>
        <div className="spinner-border text-honey" role="status">
          <span className="visually-hidden">{t.loading}</span>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="price-navigator py-5" style={{ background: '#fffbe6', paddingBottom: '6rem' }}>
      <div className="container">
        <h2 className="text-center mb-4 text-honey">
          {language === 'ru' ? 'Ценовой навигатор' : 'Price Navigator'}
        </h2>
        <p className="text-center text-muted mb-5">
          {language === 'ru' 
            ? 'Узнайте диапазон цен на нашу продукцию'
            : 'Discover our product price range'
          }
        </p>
        
        <div className="row g-4 justify-content-center">
          {/* Минимальная цена */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-scale">
              <div className="card-body text-center p-4">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-graph-down text-honey" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title mb-3">
                  {language === 'ru' ? 'Минимальная цена' : 'Minimum Price'}
                </h5>
                <p className="price display-6 text-honey mb-2">
                  {formatPrice(priceStats?.general_stats?.min_price)}
                </p>
                <p className="text-muted small">
                  {language === 'ru' 
                    ? 'Самый доступный мёд'
                    : 'Most affordable honey'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Средняя цена */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-scale">
              <div className="card-body text-center p-4">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-calculator text-honey" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title mb-3">
                  {language === 'ru' ? 'Средняя цена' : 'Average Price'}
                </h5>
                <p className="price display-6 text-honey mb-2">
                  {formatPrice(priceStats?.general_stats?.avg_price)}
                </p>
                <p className="text-muted small">
                  {language === 'ru' 
                    ? 'Средняя цена по магазину'
                    : 'Store average price'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Максимальная цена */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-scale">
              <div className="card-body text-center p-4">
                <div className="icon-wrapper mb-3">
                  <i className="bi bi-graph-up text-honey" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title mb-3">
                  {language === 'ru' ? 'Максимальная цена' : 'Maximum Price'}
                </h5>
                <p className="price display-6 text-honey mb-2">
                  {formatPrice(priceStats?.general_stats?.max_price)}
                </p>
                <p className="text-muted small">
                  {language === 'ru' 
                    ? 'Премиальный мёд'
                    : 'Premium honey'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .hover-scale {
            transition: transform 0.3s ease;
          }
          .hover-scale:hover {
            transform: translateY(-5px);
          }
          .text-honey {
            color: var(--honey-color);
          }
          .card {
            border-radius: 1rem;
            background: linear-gradient(145deg, #ffffff, #fffbe6);
          }
          .icon-wrapper {
            width: 64px;
            height: 64px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 193, 7, 0.1);
            border-radius: 50%;
          }
        `}</style>
      </div>
    </section>
  );
};

export default PriceNavigator; 