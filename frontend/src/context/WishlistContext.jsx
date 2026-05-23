import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('wishlistItems');
    if (items) {
      setWishlistItems(JSON.parse(items));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    const existItem = wishlistItems.find((x) => x._id === product._id);
    if (!existItem) {
      setWishlistItems([...wishlistItems, product]);
      return true; // Added
    }
    return false; // Already exists
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((x) => x._id !== id));
  };

  const toggleWishlist = (product) => {
    const existItem = wishlistItems.find((x) => x._id === product._id);
    if (existItem) {
      removeFromWishlist(product._id);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
