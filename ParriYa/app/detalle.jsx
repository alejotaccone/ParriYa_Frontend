import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ContadorCantidad from "../components/Contador/ContadorCantidad";
import { useCart } from "../components/CartContext";
import { styles } from "../components/Detalle/detalle.styles";
import api, { resolveProductImg } from "../services/api";
import { useTheme } from "../components/ThemeContext";
import { COLORS } from "../constants/colors";

export default function DetalleScreen() {
  const router = useRouter();
  const { idProducto } = useLocalSearchParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await api.get(`/productos/${idProducto}`);
        if (response.data) {
          const p = response.data;
          setProducto({
            id: String(p.id),
            nombre: p.nombre,
            precio: p.precio,
            image: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
            descripcionLarga: p.descripcion,
          });
        }
      } catch (error) {
        console.warn(`Error al buscar detalles del producto ${idProducto}:`, error.message);
      }
    };
    if (idProducto) {
      fetchProducto();
    }
  }, [idProducto]);

  const precioTotal = (producto?.precio || 0) * cantidad;
  const favorito = producto ? isFavorite(producto.id) : false;

  useEffect(() => {
    if (!showFavoriteModal) return;
    const timer = setTimeout(() => setShowFavoriteModal(false), 1200);
    return () => clearTimeout(timer);
  }, [showFavoriteModal]);

  useEffect(() => {
    if (!showCartModal) return;
    const timer = setTimeout(() => {
      setShowCartModal(false);
      router.replace('/(tabs)/categoria');
    }, 1200);
    return () => clearTimeout(timer);
  }, [showCartModal, router]);

  const agregarAlCarrito = () => {
    addToCart(
      {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcionLarga,
        precio: producto.precio,
        img_url: producto.image,
      },
      cantidad
    );
    setCartMessage(`Se ha agregado "${producto.nombre}" x${cantidad}`);
    setShowCartModal(true);
  };

  if (!producto) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted, fontSize: 16 }}>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Imagen Principal y Botón Volver */}
        <View style={[styles.imageContainer, { backgroundColor: colors.box }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: colors.card }]}
            onPress={() => {
              toggleFavorite({
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcionLarga,
                precio: producto.precio,
                img_url: producto.image,
              });
              setFavoriteMessage(favorito ? "Eliminado de favoritos" : "Agregado a favoritos");
              setShowFavoriteModal(true);
            }}
          >
            <Ionicons
              name={favorito ? "heart" : "heart-outline"}
              size={24}
              color={favorito ? "#E76F41" : (isDarkMode ? "white" : "black")}
            />
          </TouchableOpacity>
          <Image
            source={producto.image}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        <Modal visible={showFavoriteModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.favoriteModalOverlay}
            activeOpacity={1}
            onPress={() => setShowFavoriteModal(false)}
          >
            <View style={[styles.favoriteModalCard, { backgroundColor: colors.card }]}>
              <Ionicons name="heart" size={28} color="#E76F41" />
              <Text style={[styles.favoriteModalText, { color: colors.text }]}>{favoriteMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showCartModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.favoriteModalOverlay}
            activeOpacity={1}
            onPress={() => setShowCartModal(false)}
          >
            <View style={[styles.favoriteModalCard, { backgroundColor: colors.card }]}>
              <Ionicons name="cart" size={28} color="#4B2610" />
              <Text style={[styles.favoriteModalText, { color: colors.text }]}>{cartMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Detalles del Producto */}
        <View style={styles.infoContainer}>
          <Text style={[styles.priceValue, { color: isDarkMode ? "#ffffff" : COLORS.secondary }]}>
            ${producto.precio.toLocaleString("es-AR")}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>{producto.nombre}</Text>
          <Text style={[styles.descriptionText, { color: isDarkMode ? "#cccccc" : COLORS.textDescription }]}>
            {producto.descripcionLarga}
          </Text>

          {/* Contador de Cantidad */}
          <View style={styles.cantidadWrapper}>
            <Text style={[styles.selectorLabel, { color: colors.text }]}>Cantidad</Text>
            <ContadorCantidad
              cantidad={cantidad}
              onIncrement={() => setCantidad(cantidad + 1)}
              onDecrement={() => cantidad > 1 && setCantidad(cantidad - 1)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botón Añadir al Carrito Fijo Abajo */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={agregarAlCarrito}>
          <Text style={styles.addButtonText}>AÑADIR AL CARRITO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
