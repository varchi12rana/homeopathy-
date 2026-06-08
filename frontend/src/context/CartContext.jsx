import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch cart on login
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await api.get('/users/profile/cart');
          if (data && data.length > 0) {
            setCartItems(data);
          } else {
            // fallback to local storage if remote cart is empty
            const items = localStorage.getItem('cartItems');
            if (items) setCartItems(JSON.parse(items));
          }
        } catch (error) {
          console.error("Failed to fetch cart from server", error);
        }
      } else {
        const items = localStorage.getItem('cartItems');
        if (items) setCartItems(JSON.parse(items));
      }
    };
    fetchCart();
  }, [user]);

  // Save to local storage AND backend
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    if (user && cartItems.length >= 0) {
      // Throttle or just simple sync
      const syncCart = async () => {
        try {
          await api.put('/users/profile/cart', { cartItems });
        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      };
      syncCart();
    }
  }, [cartItems, user]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product ? { ...product, product: product._id, qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, product: product._id, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
