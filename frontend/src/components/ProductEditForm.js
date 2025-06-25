import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ProductCreationForm.css';

const ProductEditForm = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock_quantity: product?.stock_quantity || 0,
    available: product?.available ?? true,
    category: product?.category?.id || '',
    manufacturer: product?.manufacturer?.id || '',
    region: product?.region?.id || '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, manufacturersRes, regionsRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/manufacturers/'),
          api.get('/regions/')
        ]);

        // Обработка ответа для категорий
        const categoriesData = categoriesRes.data?.results || categoriesRes.data || [];
        console.log('Полученные категории:', categoriesData);
        setCategories(categoriesData);

        // Обработка ответа для производителей
        const manufacturersData = manufacturersRes.data?.results || manufacturersRes.data || [];
        setManufacturers(manufacturersData);

        // Обработка ответа для регионов
        const regionsData = regionsRes.data?.results || regionsRes.data || [];
        setRegions(regionsData);

        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Ошибка при загрузке данных');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      console.log('Обновление данных формы из продукта:', product);
      setFormData(prev => ({
        ...prev,
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || 0,
        available: product.available ?? true,
        category: product.category?.id || '',
        manufacturer: product.manufacturer?.id || '',
        region: product.region?.id || ''
      }));
      setImagePreview(product.image_url || '');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log(`Изменение поля ${name}:`, { value, type, checked, files });

    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Автоматически устанавливаем available в false, если stock_quantity равно 0
      if (parseInt(formData.stock_quantity) === 0) {
        formDataToSend.set('available', false);
      }

      const response = await api.patch(`/products/${product.slug}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      setError(error.response?.data?.error || 'Ошибка обновления товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-edit-form">
      <div className="form-header">
        <h3>Редактирование товара</h3>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>

      {loading ? (
        <div className="loading-spinner">Загрузка...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="honey-form">
          <div className="form-group">
            <label htmlFor="name">Название товара*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group col">
              <label htmlFor="price">Цена (₽)*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group col">
              <label htmlFor="discount_price">Цена со скидкой (₽)</label>
              <input
                type="number"
                id="discount_price"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col">
              <label htmlFor="stock_quantity">Количество на складе*</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="form-control"
                min="0"
                required
              />
            </div>

            <div className="form-group col">
              <div className="form-check availability-check">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="form-check-input"
                  disabled={parseInt(formData.stock_quantity) === 0}
                />
                <label className="form-check-label" htmlFor="available">
                  Доступен для заказа
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Категория:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="manufacturer">Производитель:</label>
            <select
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Выберите производителя</option>
              {Array.isArray(manufacturers) && manufacturers.map(manufacturer => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region">Регион:</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Выберите регион</option>
              {Array.isArray(regions) && regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Изображение товара</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className="form-control"
                accept="image/*"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline-honey"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-honey"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditForm; 