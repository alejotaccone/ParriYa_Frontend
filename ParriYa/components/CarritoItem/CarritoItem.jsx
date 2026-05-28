import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CarritoItem.styles";

const CarritoItem = ({ item, onRemove, onIncrement, onDecrement }) => {
  const cantidad = item.cantidad ?? 1;
  const imageSource = item.img_url || item.image;
  const description = item.descripcion || item.desc || '';

  return (
    <View style={styles.rowContainer}>
      {/* Tarjeta Principal del Producto */}
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.price}>
            ${(item.precio * cantidad).toLocaleString("es-AR")}
          </Text>
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Contador */}
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
            <Text style={styles.counterButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.counterValue}>{cantidad}</Text>

          <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        activeOpacity={0.8}
        onPress={() => onRemove(item.id)}
      >
        <Ionicons name="trash-outline" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CarritoItem;
