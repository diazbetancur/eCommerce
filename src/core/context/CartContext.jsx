import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StorageService } from '../services/storage.service';

const CartContext = createContext();
const storage = new StorageService();
const CART_KEY = 'cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Precarga el carrito desde memoria local
    const storedCart = storage.getItem(CART_KEY);
    if (storedCart) setCart(storedCart);
  }, []);

  useEffect(() => {
    // Guarda el carrito en memoria local cada vez que cambie
    storage.setItem(CART_KEY, cart);
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (productId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const value = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart, updateQuantity }), [cart]);
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
