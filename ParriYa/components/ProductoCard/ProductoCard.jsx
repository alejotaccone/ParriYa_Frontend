import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./ProductoCard.styles";
import { useCart } from "../CartContext";

// Prop `onAdd` es opcional y permite al padre manejar un "add rápido" desde la card.
const ProductoCard = ({
  item,
  mostrarFavorito = true,
  esFormatoHome = false,
  onAdd,
  onToggleFavorite,
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const isFavorito = item.fav;

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    onToggleFavorite(item);
    setFavoriteMessage(isFavorito ? "Eliminado de favoritos" : "Agregado a favoritos");
    setShowFavoriteModal(true);
  };

  const handleModalClose = () => setShowFavoriteModal(false);

  useEffect(() => {
    if (!showFavoriteModal) return;
    const timer = setTimeout(() => {
      setShowFavoriteModal(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showFavoriteModal]);

  return (
    <TouchableOpacity
      style={[styles.card, esFormatoHome ? styles.cardHome : styles.cardGrid]}
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: "/detalle", params: { idProducto: item.id } })}
    >
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image source={item.img_url || item.image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Corazón superior derecho (solo en tarjetas de categoría) */}
      {!esFormatoHome && mostrarFavorito && (
        <TouchableOpacity style={styles.heartOverlay} onPress={handleToggleFavorite}>
          <Ionicons name={isFavorito ? "heart" : "heart-outline"} size={20} color={isFavorito ? "red" : "black"} />
        </TouchableOpacity>
      )}

      <Modal visible={showFavoriteModal} transparent animationType="fade" onRequestClose={handleModalClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleModalClose}>
          <View style={styles.modalCard}>
            <Ionicons name="heart" size={30} color="#FF5A2D" />
            <Text style={styles.modalTitle}>{favoriteMessage}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Texto */}
      <Text style={styles.title} numberOfLines={1}>
        {item.nombre}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {item.descripcion || item.desc}
      </Text>

      {/* Fila inferior: precio a la izquierda y botón + a la derecha (solo en categorías) */}
      {!esFormatoHome && (
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${(item.precio || 0).toLocaleString("es-AR")}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              if (onAdd) return onAdd(item);
              addToCart(
                {
                  id: item.id,
                  nombre: item.nombre,
                  descripcion: item.descripcion || item.desc,
                  precio: item.precio || 0,
                  img_url: item.img_url || item.image,
                },
                1
              );
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProductoCard;
