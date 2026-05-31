import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
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
}) => {
  const router = useRouter();
  const { addToCart } = useCart();

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
        <TouchableOpacity
          style={styles.heartOverlay}
          onPress={(e) => e.stopPropagation()}
        >
          <Ionicons name={item.fav ? "heart" : "heart-outline"} size={20} color={item.fav ? "red" : "black"} />
        </TouchableOpacity>
      )}

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
