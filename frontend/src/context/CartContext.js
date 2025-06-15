import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalPrice: action.payload.total_price || 0,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items || [],
        totalPrice: action.payload.total_price || 0,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items || [],
        totalPrice: action.payload.total_price || 0,
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: action.payload.items || [],
        totalPrice: action.payload.total_price || 0,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalPrice: 0,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const handleUserLoggedIn = () => {
      loadCart();
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/cart/');
      if (response.data) {
        dispatch({ type: 'SET_CART', payload: response.data });
      } else {
        dispatch({ type: 'SET_CART', payload: { items: [], total_price: 0 } });
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      dispatch({ type: 'SET_CART', payload: { items: [], total_price: 0 } });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add_item/', {
        product_id: productId,
        quantity: quantity,
      });
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      return { success: true };
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      return { success: false, error: error.response?.data?.error || 'Ошибка добавления в корзину' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.post('/cart/remove_item/', {
        product_id: productId,
      });
      dispatch({ type: 'REMOVE_ITEM', payload: response.data });
      return { success: true };
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
      return { success: false, error: error.response?.data?.error || 'Ошибка удаления из корзины' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.post('/cart/update_quantity/', {
        product_id: productId,
        quantity: quantity,
      });
      dispatch({ type: 'UPDATE_QUANTITY', payload: response.data });
      return { success: true };
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
      return { success: false, error: error.response?.data?.error || 'Ошибка обновления количества' };
    }
  };

  const clearCart = async () => {
    try {
      await api.post('/cart/clear/');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
      return { success: false, error: error.response?.data?.error || 'Ошибка очистки корзины' };
    }
  };

  const value = {
    ...state,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}; 