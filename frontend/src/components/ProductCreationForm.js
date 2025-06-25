import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import './ProductCreationForm.css';

const ProductCreationForm = () => {
    const { language } = useTranslations();
    const { user, token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        manufacturer: '',
        region: '',
        stock_quantity: '',
        product_type: 'honey',
        available: true,
        image: null
    });

    // Проверка авторизации при монтировании
    useEffect(() => {
        if (!user) {
            setMessage({
                type: 'error',
                text: language === 'ru' 
                    ? 'Для создания товара необходимо войти в систему' 
                    : 'Please log in to create products'
            });
        }
    }, [user, language]);

    // Загрузка категорий, производителей и регионов
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data from API...');
                
                const [categoriesRes, manufacturersRes, regionsRes] = await Promise.all([
                    axios.get('/api/categories/'),
                    axios.get('/api/manufacturers/'),
                    axios.get('/api/regions/')
                ]);
                
                console.log('Categories response:', categoriesRes);
                console.log('Manufacturers response:', manufacturersRes);
                console.log('Regions response:', regionsRes);
                
                // Обработка данных категорий
                const categoriesData = categoriesRes.data.results || categoriesRes.data;
                if (!Array.isArray(categoriesData)) {
                    console.error('Categories data is not an array:', categoriesData);
                    throw new Error('Invalid categories data format');
                }
                setCategories(categoriesData);
                
                // Обработка данных производителей
                const manufacturersData = manufacturersRes.data.results || manufacturersRes.data;
                if (!Array.isArray(manufacturersData)) {
                    console.error('Manufacturers data is not an array:', manufacturersData);
                    throw new Error('Invalid manufacturers data format');
                }
                setManufacturers(manufacturersData);

                // Обработка данных регионов
                const regionsData = regionsRes.data.results || regionsRes.data;
                if (!Array.isArray(regionsData)) {
                    console.error('Regions data is not an array:', regionsData);
                    throw new Error('Invalid regions data format');
                }
                setRegions(regionsData);

                console.log('Data loaded successfully:', {
                    categories: categoriesData,
                    manufacturers: manufacturersData,
                    regions: regionsData
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                setMessage({
                    type: 'error',
                    text: language === 'ru' 
                        ? `Ошибка при загрузке данных: ${error.response?.data?.error || error.message}` 
                        : `Error loading data: ${error.response?.data?.error || error.message}`
                });
            }
        };
        fetchData();
    }, [language]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
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
        
        if (!user) {
            setMessage({
                type: 'error',
                text: language === 'ru' 
                    ? 'Необходимо войти в систему' 
                    : 'Please log in first'
            });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('stock_quantity', formData.stock_quantity);
            formDataToSend.append('category_id', formData.category);
            formDataToSend.append('manufacturer_id', formData.manufacturer);
            formDataToSend.append('region_id', formData.region);
            formDataToSend.append('product_type', formData.product_type);
            formDataToSend.append('available', formData.available.toString());
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            console.log('Sending data:', Object.fromEntries(formDataToSend));

            const response = await axios.post('/api/products/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response:', response.data);

            setMessage({
                type: 'success',
                text: language === 'ru' ? 'Товар успешно создан!' : 'Product successfully created!'
            });
            
            // Очищаем форму
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                manufacturer: '',
                region: '',
                stock_quantity: '',
                product_type: 'honey',
                available: true,
                image: null
            });
            
            // Очищаем поле файла
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Error creating product:', error.response?.data || error);
            setMessage({
                type: 'error',
                text: language === 'ru' 
                    ? `Ошибка при создании товара: ${error.response?.data?.error || error.message}`
                    : `Error creating product: ${error.response?.data?.error || error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const productTypes = {
        honey: language === 'ru' ? 'Мёд' : 'Honey',
        propolis: language === 'ru' ? 'Прополис' : 'Propolis',
        pollen: language === 'ru' ? 'Пыльца' : 'Pollen',
        wax: language === 'ru' ? 'Воск' : 'Wax',
        comb: language === 'ru' ? 'Соты' : 'Honeycomb'
    };

    return (
        <div className="product-creation-form">
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="honey-form">
                <div className="form-group">
                    <label htmlFor="name">
                        {language === 'ru' ? 'Название товара' : 'Product Name'}*
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        {language === 'ru' ? 'Описание' : 'Description'}*
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">
                            {language === 'ru' ? 'Цена' : 'Price'}*
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stock_quantity">
                            {language === 'ru' ? 'Количество на складе' : 'Stock Quantity'}*
                        </label>
                        <input
                            type="number"
                            id="stock_quantity"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">
                            {language === 'ru' ? 'Категория' : 'Category'}*
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        >
                            <option value="">
                                {language === 'ru' ? 'Выберите категорию' : 'Select category'}
                            </option>
                            {categories && categories.length > 0 && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="manufacturer">
                            {language === 'ru' ? 'Производитель' : 'Manufacturer'}*
                        </label>
                        <select
                            id="manufacturer"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        >
                            <option value="">
                                {language === 'ru' ? 'Выберите производителя' : 'Select manufacturer'}
                            </option>
                            {manufacturers && manufacturers.length > 0 && manufacturers.map(manufacturer => (
                                <option key={manufacturer.id} value={manufacturer.id}>
                                    {manufacturer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="region">
                            {language === 'ru' ? 'Регион' : 'Region'}*
                        </label>
                        <select
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        >
                            <option value="">
                                {language === 'ru' ? 'Выберите регион' : 'Select region'}
                            </option>
                            {regions && regions.length > 0 && regions.map(region => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="product_type">
                            {language === 'ru' ? 'Тип продукта' : 'Product Type'}*
                        </label>
                        <select
                            id="product_type"
                            name="product_type"
                            value={formData.product_type}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        >
                            {Object.entries(productTypes).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">
                            {language === 'ru' ? 'Изображение товара' : 'Product Image'}*
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleInputChange}
                            accept="image/*"
                            required
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                available: e.target.checked
                            }))}
                        />
                        {language === 'ru' ? 'Доступен для продажи' : 'Available for sale'}
                    </label>
                </div>

                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                >
                    {loading ? 
                        (language === 'ru' ? 'Создание...' : 'Creating...') : 
                        (language === 'ru' ? 'Создать товар' : 'Create Product')
                    }
                </button>
            </form>
        </div>
    );
};

export default ProductCreationForm; 