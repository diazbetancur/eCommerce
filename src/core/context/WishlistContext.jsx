import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StorageService } from '../services/storage.service';

const WishlistContext = createContext();
const storage = new StorageService();
const WISHLIST_KEY = 'wishlist';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Precarga la wishlist desde memoria local
    const storedWishlist = storage.getItem(WISHLIST_KEY);
    if (storedWishlist) setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    // Guarda la wishlist en memoria local cada vez que cambie
    storage.setItem(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  const value = useMemo(() => ({ wishlist, addToWishlist, removeFromWishlist, clearWishlist }), [wishlist]);
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
