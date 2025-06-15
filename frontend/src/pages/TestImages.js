import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getStaticImageUrl, STATIC_IMAGES } from '../utils/images';

const TestImages = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/');
      const productsData = response.data.results || response.data;
      setProducts(productsData.slice(0, 8)); // Берем первые 8 товаров для теста
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="text-center">Загрузка...</div></div>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Тест загрузки изображений</h1>
      
      {/* Статические изображения */}
      <div className="mb-5">
        <h2 className="text-honey mb-4">Статические изображения</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY)}
                  alt="Header Apiary"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                  onLoad={() => console.log('✅ Статическое изображение загружено:', STATIC_IMAGES.HEADER_APIARY)}
                  onError={(e) => {
                    console.error('❌ Ошибка загрузки статического изображения:', STATIC_IMAGES.HEADER_APIARY);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="card-body">
                <h6 className="card-title">Header Apiary</h6>
                <small className="text-muted">
                  URL: {getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY)}
                </small>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card">
              <div style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={getStaticImageUrl(STATIC_IMAGES.ABOUT_BANNER)}
                  alt="About Banner"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                  onLoad={() => console.log('✅ Статическое изображение загружено:', STATIC_IMAGES.ABOUT_BANNER)}
                  onError={(e) => {
                    console.error('❌ Ошибка загрузки статического изображения:', STATIC_IMAGES.ABOUT_BANNER);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="card-body">
                <h6 className="card-title">About Banner</h6>
                <small className="text-muted">
                  URL: {getStaticImageUrl(STATIC_IMAGES.ABOUT_BANNER)}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Изображения товаров */}
      <div className="mb-5">
        <h2 className="text-honey mb-4">Изображения товаров</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card">
                <div style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.image_url ? (
                    <img 
                      src={product.image_url}
                      alt={product.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                      onLoad={() => console.log('✅ Изображение товара загружено:', product.image_url)}
                      onError={(e) => {
                        console.error('❌ Ошибка загрузки изображения товара:', product.image_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-muted">Нет изображения</span>
                  )}
                </div>
                <div className="card-body">
                  <h6 className="card-title">{product.name}</h6>
                  <small className="text-muted">
                    Image URL: {product.image_url || 'Отсутствует'}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Изображения команды */}
      <div className="mb-5">
        <h2 className="text-honey mb-4">Команда</h2>
        <div className="row">
          {[STATIC_IMAGES.TEAM_1, STATIC_IMAGES.TEAM_2, STATIC_IMAGES.TEAM_3].map((teamImage, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <div style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={getStaticImageUrl(teamImage)}
                    alt={`Team ${index + 1}`}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                    onLoad={() => console.log('✅ Изображение команды загружено:', teamImage)}
                    onError={(e) => {
                      console.error('❌ Ошибка загрузки изображения команды:', teamImage);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title">Team {index + 1}</h6>
                  <small className="text-muted">
                    URL: {getStaticImageUrl(teamImage)}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestImages; 