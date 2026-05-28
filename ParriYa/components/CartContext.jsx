import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);
const STORAGE_KEY = 'shoppingCart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (e) {
        // ignore
      }
    }
    loadCart();
  }, []);

  useEffect(() => {
    async function saveCart() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch (e) {
        // ignore
      }
    }
    saveCart();
  }, [cartItems]);

  const addToCart = (product, cantidad = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...product, cantidad }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: cantidad > 0 ? cantidad : 0 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
