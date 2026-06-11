import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./ProductoCard.styles";
import { useCart } from "../CartContext";
import { useTheme } from "../ThemeContext";
import { COLORS } from "../../constants/colors";

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
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const { colors, isDarkMode } = useTheme();

  const isFavorito = item.fav;

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    onToggleFavorite(item);
    setFavoriteMessage(isFavorito ? "Eliminado de favoritos" : "Agregado a favoritos");
    setShowFavoriteModal(true);
  };

  const handleModalClose = () => {
    setShowFavoriteModal(false);
    setShowCartModal(false);
  };

  useEffect(() => {
    if (!showFavoriteModal) return;
    const timer = setTimeout(() => {
      setShowFavoriteModal(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showFavoriteModal]);

  useEffect(() => {
    if (!showCartModal) return;
    const timer = setTimeout(() => {
      setShowCartModal(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showCartModal]);

  return (
    <View style={esFormatoHome ? styles.cardHome : styles.cardGrid}>
      <TouchableOpacity
        style={[
          styles.card, 
          { 
            backgroundColor: colors.card, 
            borderColor: isDarkMode ? colors.border : 'transparent', 
            borderWidth: isDarkMode ? 1 : 0 
          }
        ]}
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
            <Ionicons name={isFavorito ? "heart" : "heart-outline"} size={20} color={isFavorito ? "red" : (isDarkMode ? "white" : "black")} />
          </TouchableOpacity>
        )}

        <Modal visible={showFavoriteModal} transparent animationType="fade" onRequestClose={handleModalClose}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleModalClose}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : 'transparent', borderWidth: isDarkMode ? 1 : 0 }]}>
              <Ionicons name="heart" size={30} color="#FF5A2D" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>{favoriteMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showCartModal} transparent animationType="fade" onRequestClose={handleModalClose}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleModalClose}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : 'transparent', borderWidth: isDarkMode ? 1 : 0 }]}>
              <Ionicons name="cart" size={30} color="#4B2610" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>{cartMessage}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Texto */}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
          {item.descripcion || item.desc}
        </Text>

        {/* Fila inferior: precio a la izquierda y botón + a la derecha (solo en categorías) */}
        {!esFormatoHome && (
          <View style={styles.bottomRow}>
            <Text style={[styles.price, { color: colors.text }]}>${(item.precio || 0).toLocaleString("es-AR")}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                if (onAdd) {
                  onAdd(item);
                } else {
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
                }
                setCartMessage(`Se ha agregado "${item.nombre}" x1`);
                setShowCartModal(true);
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProductoCard;
