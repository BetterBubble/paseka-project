from decimal import Decimal

class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if not cart:
            cart = self.session['cart'] = {}
        self.cart = cart

    def add(self, product, quantity=1, update_quantity=False):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'quantity': 0,
                'price': str(product.price),
                'total_price': '0'
            }
        
        if update_quantity:
            self.cart[product_id]['quantity'] = int(quantity)
        else:
            self.cart[product_id]['quantity'] = self.cart[product_id]['quantity'] + int(quantity)
        
        # Обновляем total_price
        self.cart[product_id]['total_price'] = str(
            Decimal(self.cart[product_id]['price']) * self.cart[product_id]['quantity']
        )
        self.save()

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def save(self):
        self.session['cart'] = self.cart
        self.session.modified = True

    def clear(self):
        self.cart = {}
        self.session['cart'] = self.cart
        self.save()

    def __iter__(self):
        from .models import Product
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)
        
        for product in products:
            item = self.cart[str(product.id)].copy()
            item['product'] = product
            item['price'] = Decimal(item['price'])
            item['total_price'] = Decimal(item['total_price'])
            yield item

    def __len__(self):
        return len(self.cart)

    def get_total_price(self):
        return sum(Decimal(item['total_price']) for item in self.cart.values())