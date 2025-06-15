import React, { useState, useEffect } from 'react';
import { getStaticImageUrl, getMediaUrl, STATIC_IMAGES } from '../utils/images';

const ImageStatus = () => {
  const [imageStatus, setImageStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkImages();
  }, []);

  const checkImages = async () => {
    const imagesToCheck = [
      { name: 'Header Apiary', url: getStaticImageUrl(STATIC_IMAGES.HEADER_APIARY) },
      { name: 'About Banner', url: getStaticImageUrl(STATIC_IMAGES.ABOUT_BANNER) },
      { name: 'About Main', url: getStaticImageUrl(STATIC_IMAGES.ABOUT_MAIN) },
      { name: 'Team 1', url: getStaticImageUrl(STATIC_IMAGES.TEAM_1) },
      { name: 'Team 2', url: getStaticImageUrl(STATIC_IMAGES.TEAM_2) },
      { name: 'Team 3', url: getStaticImageUrl(STATIC_IMAGES.TEAM_3) },
    ];

    const results = {};
    
    for (const image of imagesToCheck) {
      try {
        const response = await fetch(image.url, { method: 'HEAD' });
        results[image.name] = {
          status: response.ok ? 'success' : 'error',
          url: image.url,
          statusCode: response.status
        };
      } catch (error) {
        results[image.name] = {
          status: 'error',
          url: image.url,
          error: error.message
        };
      }
    }

    setImageStatus(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container py-3">
        <div className="alert alert-info">
          <i className="bi bi-clock me-2"></i>
          Проверка загрузки изображений...
        </div>
      </div>
    );
  }

  const successCount = Object.values(imageStatus).filter(img => img.status === 'success').length;
  const totalCount = Object.keys(imageStatus).length;

  return (
    <div className="container py-3">
      <div className={`alert ${successCount === totalCount ? 'alert-success' : 'alert-warning'}`}>
        <h6 className="mb-3">
          <i className="bi bi-image me-2"></i>
          Статус изображений: {successCount}/{totalCount} загружено
        </h6>
        
        <div className="row">
          {Object.entries(imageStatus).map(([name, info]) => (
            <div key={name} className="col-md-6 col-lg-4 mb-2">
              <div className="d-flex align-items-center">
                <i className={`bi ${info.status === 'success' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-2`}></i>
                <small>
                  <strong>{name}:</strong> {info.status === 'success' ? 'OK' : `Ошибка (${info.statusCode || 'Network'})`}
                </small>
              </div>
            </div>
          ))}
        </div>
        
        {successCount < totalCount && (
          <div className="mt-3">
            <button className="btn btn-sm btn-outline-primary" onClick={checkImages}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Проверить снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageStatus; 