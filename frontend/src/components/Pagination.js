import React from 'react';
import { useTranslations } from './LanguageSwitcher';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { language } = useTranslations();

  // Создаем массив номеров страниц
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимальное количество видимых номеров страниц

    if (totalPages <= maxVisiblePages) {
      // Если общее количество страниц меньше или равно maxVisiblePages, показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Иначе показываем страницы с многоточием
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center">
        {/* Кнопка "Предыдущая" */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--honey-color)',
              color: 'var(--honey-color)'
            }}
          >
            {language === 'ru' ? 'Предыдущая' : 'Previous'}
          </button>
        </li>

        {/* Номера страниц */}
        {getPageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => page !== '...' && onPageChange(page)}
              style={{
                backgroundColor: currentPage === page ? 'var(--honey-color)' : 'transparent',
                border: '1px solid var(--honey-color)',
                color: currentPage === page ? 'white' : 'var(--honey-color)'
              }}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Кнопка "Следующая" */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--honey-color)',
              color: 'var(--honey-color)'
            }}
          >
            {language === 'ru' ? 'Следующая' : 'Next'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 