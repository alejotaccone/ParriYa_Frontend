import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CarritoItem.styles";

const CarritoItem = ({ item, onRemove }) => {
  const [cantidad, setCantidad] = useState(1);
  const [mostrarTacho, setMostrarTacho] = useState(false);

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    } else {
      setMostrarTacho(true);
    }
  };

  const handleIncrement = () => {
    setCantidad(cantidad + 1);
    if (mostrarTacho) setMostrarTacho(false); 
  };

  return (
    <View style={styles.rowContainer}>
      {/* Tarjeta Principal del Producto */}
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.price}>
            ${(item.precio * cantidad).toLocaleString("es-AR")}
          </Text>
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.description}>{item.desc}</Text>
        </View>

        {/* Contador */}
        <View style={styles.counterContainer}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={styles.counterButton}
          >
            <Text style={styles.counterButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.counterValue}>{cantidad}</Text>

          <TouchableOpacity
            onPress={handleIncrement}
            style={styles.counterButton}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de Eliminación */}
      {mostrarTacho && (
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={() => onRemove(item.id)}
        >
          <Ionicons name="trash-outline" size={26} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CarritoItem;
