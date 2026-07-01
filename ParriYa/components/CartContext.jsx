import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { logEvent } from '../services/analytics';

const CartContext = createContext(null);
const STORAGE_KEY = 'shoppingCart';
const FAVORITES_KEY = 'favoriteProducts';

// Límites máximos de unidades por categoría (por nombre, case-insensitive)
const LIMITES_POR_CATEGORIA = {
  carnes: 8,
  achuras: 12,
  guarniciones: 12,
  bebidas: 15,
};

/**
 * Cuenta las unidades totales de una categoría en el carrito.
 */
function contarUnidadesCategoria(items, categoriaNombre, excludeItemId = null) {
  if (!categoriaNombre) return 0;
  const nombreLower = categoriaNombre.toLowerCase();
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (excludeItemId && item.id === excludeItemId) continue;
    if ((item.categoriaNombre || '').toLowerCase() === nombreLower) {
      total += item.cantidad;
    }
  }
  return total;
}

/**
 * Verifica si agregar cantidadNueva unidades de una categoría excede el límite.
 */
function verificarLimite(items, categoriaNombre, cantidadNueva, excludeItemId = null) {
  if (!categoriaNombre) return null;
  const nombreLower = categoriaNombre.toLowerCase();
  const limite = LIMITES_POR_CATEGORIA[nombreLower];
  if (limite === undefined) return null;

  const actuales = contarUnidadesCategoria(items, categoriaNombre, excludeItemId);
  if (actuales + cantidadNueva > limite) {
    // Para mostrar en el modal, usamos el total REAL (sin excluir ningún item)
    const totalReal = contarUnidadesCategoria(items, categoriaNombre, null);
    return { limite, categoriaNombre, actuales: totalReal };
  }
  return null;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Estado del modal de límite
  const [limiteModal, setLimiteModal] = useState({ visible: false, limite: 0, categoria: '', actuales: 0 });

  const cartRef = useRef(cartItems);
  cartRef.current = cartItems;

  // Función para mostrar el modal de límite
  const mostrarLimiteAlcanzado = (limite, categoria, actuales) => {
    setLimiteModal({ visible: true, limite, categoria, actuales });
  };

  const cerrarLimiteModal = () => {
    setLimiteModal((prev) => ({ ...prev, visible: false }));
  };

  // Carga inicial desde AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const storedFavs = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) setCartItems(JSON.parse(stored));
        if (storedFavs) setFavoriteItems(JSON.parse(storedFavs));
      } catch (e) {
        // ignore
      }
      setLoaded(true);
    })();
  }, []);

  // Persistir carrito
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems)).catch(() => {});
  }, [cartItems, loaded]);

  // Persistir favoritos
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteItems)).catch(() => {});
  }, [favoriteItems, loaded]);

  // --- Funciones del carrito ---

  const addToCart = useMemo(() => (product, cantidad = 1) => {
    const current = cartRef.current;
    const catName = product.categoriaNombre || '';

    // Validar límite de categoría
    const excedido = verificarLimite(current, catName, cantidad);
    if (excedido) {
      mostrarLimiteAlcanzado(excedido.limite, excedido.categoriaNombre, excedido.actuales);
      return false;
    }

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
    logEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.nombre,
      price: product.precio,
      quantity: cantidad,
      value: product.precio * cantidad,
      currency: 'ARS',
    });
    return true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFromCart = useMemo(() => (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useMemo(() => (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    }

    const current = cartRef.current;
    const item = current.find((i) => i.id === id);
    if (!item) return false;

    // Solo validar si se incrementa
    if (nuevaCantidad > item.cantidad && item.categoriaNombre) {
      const excedido = verificarLimite(current, item.categoriaNombre, nuevaCantidad, id);
      if (excedido) {
        mostrarLimiteAlcanzado(excedido.limite, excedido.categoriaNombre, excedido.actuales);
        return false;
      }
    }

    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: nuevaCantidad } : i))
        .filter((i) => i.cantidad > 0)
    );
    return true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [retiroMode, setRetiroMode] = useState('inmediato'); // 'inmediato' | 'programado'
  const [retiroTime, setRetiroTime] = useState(null); // string 'HH:mm:ss' or null

  const clearCart = useMemo(() => () => {
    setCartItems([]);
    setRetiroMode('inmediato');
    setRetiroTime(null);
  }, []);

  const toggleFavorite = useMemo(() => (product) => {
    setFavoriteItems((prev) => {
      const alreadyFav = prev.some((item) => item.id === product.id);
      if (alreadyFav) {
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

  const isFavorite = useMemo(() => (id) => {
    return favoriteItems.some((item) => item.id === id);
  }, [favoriteItems]);

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
    retiroMode,
    setRetiroMode,
    retiroTime,
    setRetiroTime,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isFavorite,
  }), [cartItems, favoriteItems, itemCount, cartTotal, retiroMode, retiroTime, addToCart, removeFromCart, updateQuantity, clearCart, toggleFavorite, isFavorite]);

  return (
    <CartContext.Provider value={providerValue}>
      {children}

      {/* Modal de límite de categoría alcanzado */}
      <Modal
        visible={limiteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={cerrarLimiteModal}
      >
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={cerrarLimiteModal}
        >
          <View style={modalStyles.card}>
            {/* Icono de advertencia */}
            <View style={modalStyles.iconContainer}>
              <Ionicons name="warning" size={36} color="#fff" />
            </View>

            {/* Título */}
            <Text style={modalStyles.title}>Límite alcanzado</Text>

            {/* Mensaje */}
            <Text style={modalStyles.message}>
              No podés agregar más de{' '}
              <Text style={modalStyles.bold}>{limiteModal.limite} unidades</Text>
              {' '}de la categoría{' '}
              <Text style={modalStyles.bold}>{limiteModal.categoria}</Text>
              {' '}en total.
            </Text>

            <Text style={modalStyles.submessage}>
              Ya tenés {limiteModal.actuales} unidades en tu carrito.
            </Text>

            {/* Botón Entendido */}
            <TouchableOpacity
              style={modalStyles.button}
              activeOpacity={0.8}
              onPress={cerrarLimiteModal}
            >
              <Text style={modalStyles.buttonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </CartContext.Provider>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E76F41',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
  submessage: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#E76F41',
  },
  button: {
    backgroundColor: '#E76F41',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

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
