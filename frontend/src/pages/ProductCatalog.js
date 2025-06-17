import React, { useState, useEffect } from 'react';
import { useTranslations } from '../components/LanguageSwitcher';
import api from '../services/api';
import './ProductCatalog.css';
import ProductCard from '../components/ProductCard';

const ProductCatalog = () => {
  const { t } = useTranslations(); // Подключаем переводы
  
  // ... existing state variables ...

  // ... existing useEffect and functions ...

  return (
    <div className="product-catalog">
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">{t.catalog}</h1>
          <p className="catalog-subtitle">
            {t.language === 'ru' 
              ? 'Натуральные продукты пчеловодства высочайшего качества'
              : 'Premium natural beekeeping products of the highest quality'
            }
          </p>
        </div>

        {/* Фильтры */}
        <div className="catalog-filters">
          <div className="filter-group">
            <label htmlFor="category-filter">
              {t.category}:
            </label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">
                {t.language === 'ru' ? 'Все категории' : 'All categories'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="manufacturer-filter">
              {t.manufacturer}:
            </label>
            <select 
              id="manufacturer-filter"
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              <option value="">
                {t.language === 'ru' ? 'Все производители' : 'All manufacturers'}
              </option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search-input">
              {t.search}
            </label>
            <input
              id="search-input"
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Товары */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 animate__animated animate__fadeInUp">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>
              {t.language === 'ru' 
                ? 'Товары не найдены' 
                : 'No products found'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog; 