function sortProducts(value) {
    const products = document.querySelectorAll('.product-card');
    const productsArray = Array.from(products);
    
    productsArray.sort((a, b) => {
        switch(value) {
            case 'price_asc':
                return getPrice(a) - getPrice(b);
            case 'price_desc':
                return getPrice(b) - getPrice(a);
            case 'name_asc':
                return getName(a).localeCompare(getName(b));
            case 'name_desc':
                return getName(b).localeCompare(getName(a));
            default:
                return 0;
        }
    });
    
    const container = document.querySelector('.products-container');
    productsArray.forEach(product => container.appendChild(product));
}

function filterProducts(value) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const type = product.dataset.type;
        if (!value || type === value) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}

function getPrice(element) {
    const priceElement = element.querySelector('.current-price');
    return priceElement ? parseFloat(priceElement.textContent) : 0;
}

function getName(element) {
    const nameElement = element.querySelector('.product-title');
    return nameElement ? nameElement.textContent : '';
} 