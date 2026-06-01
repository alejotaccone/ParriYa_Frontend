import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ContadorCantidad from "../components/Contador/ContadorCantidad";
import { PRODUCTOS } from "../constants/mocks";
import { useCart } from "../components/CartContext";
import { styles } from "../components/Detalle/detalle.styles";

const DETALLE_PRODUCTOS = Object.fromEntries(
  PRODUCTOS.map(p => [
    p.id,
    {
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      image: p.img_url,
      descripcionLarga: p.descripcion,
    }
  ])
);

export default function DetalleScreen() {
  const router = useRouter();
  const { idProducto } = useLocalSearchParams();
  const producto = DETALLE_PRODUCTOS[idProducto] || DETALLE_PRODUCTOS["1"];

  const [cantidad, setCantidad] = useState(1);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const precioTotal = producto.precio * cantidad;
  const favorito = isFavorite(producto.id);

  useEffect(() => {
    if (!showFavoriteModal) return;
    const timer = setTimeout(() => setShowFavoriteModal(false), 1200);
    return () => clearTimeout(timer);
  }, [showFavoriteModal]);

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
    router.replace('/(tabs)/categoria');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Imagen Principal y Botón Volver */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
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
              color={favorito ? "#E76F41" : "black"}
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
            <View style={styles.favoriteModalCard}>
              <Ionicons name="heart" size={28} color="#E76F41" />
              <Text style={styles.favoriteModalText}>{favoriteMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Detalles del Producto */}
        <View style={styles.infoContainer}>
          <Text style={styles.priceValue}>
            ${producto.precio.toLocaleString("es-AR")}
          </Text>
          <Text style={styles.title}>{producto.nombre}</Text>
          <Text style={styles.descriptionText}>
            {producto.descripcionLarga}
          </Text>

          {/* Contador de Cantidad */}
          <View style={styles.cantidadWrapper}>
            <Text style={styles.selectorLabel}>Cantidad</Text>
            <ContadorCantidad
              cantidad={cantidad}
              onIncrement={() => setCantidad(cantidad + 1)}
              onDecrement={() => cantidad > 1 && setCantidad(cantidad - 1)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botón Añadir al Carrito Fijo Abajo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={agregarAlCarrito}>
          <Text style={styles.addButtonText}>AÑADIR AL CARRITO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
