import React, { useState, useEffect } from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const [currentLanguage, setCurrentLanguage] = useState('ru');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'ru';
        console.log('LanguageSwitcher - Saved language:', savedLanguage);
        
        // Устанавливаем русский по умолчанию, если ничего не сохранено
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'ru');
        }
        
        setCurrentLanguage(savedLanguage);
        console.log('LanguageSwitcher - Current language set to:', savedLanguage);
        
        // Отправляем событие для синхронизации с другими компонентами
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: savedLanguage }));
    }, []);

    const changeLanguage = (language) => {
        console.log('LanguageSwitcher - Changing language to:', language);
        setCurrentLanguage(language);
        localStorage.setItem('language', language);
        
        // Отправляем событие для обновления других компонентов
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    };

    return (
        <div className="language-switcher">
            <button 
                className={`lang-btn ${currentLanguage === 'ru' ? 'active' : ''}`}
                onClick={() => changeLanguage('ru')}
            >
                🇷🇺 РУС
            </button>
            <button 
                className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
            >
                🇺🇸 ENG
            </button>
        </div>
    );
};

// Хук для использования переводов в компонентах
export const useTranslations = () => {
    const [language, setLanguage] = useState('ru');
    
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'ru';
        console.log('useTranslations - Saved language from localStorage:', savedLanguage);
        
        // Устанавливаем русский по умолчанию, если ничего не сохранено
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'ru');
        }
        
        setLanguage(savedLanguage);
        console.log('useTranslations - Current language set to:', savedLanguage);

        // Слушаем изменения языка
        const handleLanguageChange = (event) => {
            console.log('useTranslations - Language changed to:', event.detail);
            setLanguage(event.detail);
        };

        window.addEventListener('languageChanged', handleLanguageChange);
        
        return () => {
            window.removeEventListener('languageChanged', handleLanguageChange);
        };
    }, []);

    const interfaceTranslations = {
        ru: {
            catalog: 'Каталог товаров',
            cart: 'Корзина',
            addToCart: 'Добавить в корзину',
            placeOrder: 'Оформить заказ',
            about: 'О компании',
            contact: 'Контакты',
            login: 'Войти',
            register: 'Регистрация',
            search: 'Поиск...',
            price: 'Цена',
            inStock: 'В наличии',
            outOfStock: 'Нет в наличии',
            total: 'Итого',
            quantity: 'Количество',
            description: 'Описание',
            category: 'Категория',
            manufacturer: 'Производитель',
            home: 'Главная',
            categories: 'Категории',
            allProducts: 'Все товары',
            allCategories: 'Все категории',
            allManufacturers: 'Все производители',
            noProductsFound: 'Товары не найдены',
            loading: 'Загрузка...',
            error: 'Ошибка',
            addedToCart: 'Товар добавлен в корзину!',
            emptyCart: 'Корзина пуста',
            checkout: 'Оформить заказ',
            removeFromCart: 'Удалить из корзины'
        },
        en: {
            catalog: 'Product Catalog',
            cart: 'Cart',
            addToCart: 'Add to Cart',
            placeOrder: 'Place Order',
            about: 'About Company',
            contact: 'Contacts',
            login: 'Login',
            register: 'Register',
            search: 'Search...',
            price: 'Price',
            inStock: 'In Stock',
            outOfStock: 'Out of Stock',
            total: 'Total',
            quantity: 'Quantity',
            description: 'Description',
            category: 'Category',
            manufacturer: 'Manufacturer',
            home: 'Home',
            categories: 'Categories',
            allProducts: 'All Products',
            allCategories: 'All Categories',
            allManufacturers: 'All Manufacturers',
            noProductsFound: 'No products found',
            loading: 'Loading...',
            error: 'Error',
            addedToCart: 'Product added to cart!',
            emptyCart: 'Cart is empty',
            checkout: 'Checkout',
            removeFromCart: 'Remove from cart'
        }
    };

    return {
        language,
        t: interfaceTranslations[language] || interfaceTranslations.ru,
        setLanguage
    };
};

export default LanguageSwitcher; 