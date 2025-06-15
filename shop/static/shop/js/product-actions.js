document.addEventListener('DOMContentLoaded', function() {
    // Добавить в корзину (AJAX)
    document.querySelectorAll('.btn-add-to-cart').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = btn.getAttribute('data-url');
            fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (response.redirected) {
                    // Если требуется авторизация — редирект
                    window.location.href = response.url;
                } else {
                    return response.text();
                }
            })
            .then(() => {
                // Можно обновить счетчик корзины или показать уведомление
                alert('Товар добавлен в корзину!');
                // TODO: обновить счетчик корзины на странице без перезагрузки
            })
            .catch(() => alert('Ошибка при добавлении в корзину.'));
        });
    });

    // Подробнее (AJAX-заглушка)
    document.querySelectorAll('.btn-details').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = btn.getAttribute('data-url');
            // Можно реализовать модальное окно с деталями товара через fetch(url)
            window.location.href = url; // пока просто переход
        });
    });
}); 