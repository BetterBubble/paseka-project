import React, { useState, useEffect } from 'react';
import { useTranslations } from '../components/LanguageSwitcher';
import api from '../services/api';
import './ProductCatalog.css';

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
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image || '/api/placeholder/300/200'} 
                  alt={product.name}
                />
                {product.discount_price && (
                  <div className="discount-badge">
                    -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  <span className="product-availability">
                    {product.available ? t.inStock : t.outOfStock}
                  </span>
                </div>

                <div className="product-pricing">
                  {product.discount_price ? (
                    <>
                      <span className="price-original">{product.price}₽</span>
                      <span className="price-discount">{product.discount_price}₽</span>
                    </>
                  ) : (
                    <span className="price-current">{product.price}₽</span>
                  )}
                </div>

                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.available}
                >
                  {t.addToCart}
                </button>
              </div>
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