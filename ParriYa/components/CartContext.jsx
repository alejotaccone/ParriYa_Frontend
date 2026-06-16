import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const CartContext = createContext(null);
const STORAGE_KEY = 'shoppingCart';
const FAVORITES_KEY = 'favoriteProducts';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
        if (storedFavorites) {
          setFavoriteItems(JSON.parse(storedFavorites));
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

  useEffect(() => {
    async function saveFavorites() {
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteItems));
      } catch (e) {
        // ignore
      }
    }
    saveFavorites();
  }, [favoriteItems]);

  const addToCart = useCallback((product, cantidad = 1) => {
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
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, cantidad) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: cantidad > 0 ? cantidad : 0 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleFavorite = useCallback((product) => {
    setFavoriteItems((prev) => {
      const alreadyFavorite = prev.some((item) => item.id === product.id);
      if (alreadyFavorite) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [
        ...prev,
        {
          id: product.id,
          nombre: product.nombre,
          descripcion: product.descripcion || product.desc,
          precio: product.precio || 0,
          img_url: product.img_url || product.image,
        },
      ];
    });
  }, []);

  const isFavorite = useCallback((id) => favoriteItems.some((item) => item.id === id), [favoriteItems]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems]
  );

  const providerValue = useMemo(() => ({
    cartItems,
    favoriteItems,
    itemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
  }), [cartItems, favoriteItems, itemCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, toggleFavorite, isFavorite]);

  return (
    <CartContext.Provider value={providerValue}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
