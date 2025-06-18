import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import ImageStatus from './components/ImageStatus';
import OrdersPage from './pages/OrdersPage';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/category/:categorySlug" element={<ProductList />} />
              <Route path="/product/:productSlug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/image-status" element={<ImageStatus />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 