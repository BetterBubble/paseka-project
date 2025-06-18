// Утилиты для работы с изображениями

const DJANGO_BASE_URL = 'http://localhost:8000';

// Получить URL статического изображения
export const getStaticImageUrl = (imagePath) => {
  return `${DJANGO_BASE_URL}/static/shop/assets/${imagePath}`;
};

// Получить URL медиафайла
export const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return null;
  if (mediaPath.startsWith('http')) return mediaPath;
  return `${DJANGO_BASE_URL}${mediaPath}`;
};

// Обработчик ошибок загрузки изображений
export const handleImageError = (e, fallbackSrc = null) => {
  if (fallbackSrc) {
    e.target.src = fallbackSrc;
  } else {
    e.target.style.display = 'none';
  }
  console.warn('Ошибка загрузки изображения:', e.target.src);
};

// Предзагрузка изображения
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Список статических изображений для предзагрузки
export const STATIC_IMAGES = {
  HEADER_APIARY: 'Header_apiary.png',
  ABOUT_BANNER: 'about_banner.png',
  ABOUT_MAIN: 'about_main.png',
  TEAM_1: 'team1.png',
  TEAM_2: 'team2.png',
  TEAM_3: 'team3.png',
  FAVICON: 'favicon.ico'
};

// Предзагрузить критические изображения
export const preloadCriticalImages = async () => {
  const criticalImages = [
    STATIC_IMAGES.HEADER_APIARY,
    STATIC_IMAGES.ABOUT_BANNER
  ];

  try {
    await Promise.all(
      criticalImages.map(imageName => 
        preloadImage(getStaticImageUrl(imageName))
      )
    );
    console.log('Критические изображения предзагружены');
  } catch (error) {
    console.warn('Ошибка предзагрузки изображений:', error);
  }
}; 