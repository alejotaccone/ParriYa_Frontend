import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./ProductoCard.styles";

// Agregamos las propiedades de configuración con valores por defecto
const ProductoCard = ({
  item,
  mostrarFavorito = true,
  esFormatoHome = false,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      // Aplicamos estilos dinámicos según el formato que necesitemos
      style={[styles.card, esFormatoHome ? styles.cardHome : styles.cardGrid]}
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/detalle", params: { idProducto: item.id } })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.nombre}
      </Text>
      <Text style={styles.subtitle}>{item.desc}</Text>

      {/* RENDERIZADO CONDICIONAL: Solo dibuja el corazón si mostrarFavorito es true */}
      {mostrarFavorito && (
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={(e) => e.stopPropagation()}
        >
          <Ionicons
            name={item.fav ? "heart" : "heart-outline"}
            size={24}
            color={item.fav ? "red" : "black"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ProductoCard;
