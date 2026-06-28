import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from 'prop-types';
import { styles } from "./CarritoItem.styles";
import { useTheme } from "../ThemeContext";
import { COLORS } from "../../constants/colors";

const CarritoItem = ({ item, onRemove, onIncrement, onDecrement }) => {
  const cantidad = item.cantidad ?? 1;
  const imageSource = item.img_url || item.image;
  const description = item.descripcion || item.desc || '';
  const { colors, isDarkMode } = useTheme();

  // 1. Estado local para controlar si se muestra el tacho lateral
  const [showDelete, setShowDelete] = useState(false);

  // 2. Si la cantidad vuelve a subir (ej. tocan el "+"), escondemos el tacho automáticamente
  useEffect(() => {
    if (cantidad > 1) {
      setShowDelete(false);
    }
  }, [cantidad]);

  // 3. Manejador del botón menos
  const handleDecrement = () => {
    if (cantidad === 1) {
      // Si la cantidad es 1, mostramos el tacho naranja lateral en lugar de eliminar directo
      setShowDelete(true);
    } else {
      // Si es mayor a 1, resta común y corriente
      onDecrement();
    }
  };

  return (
    <View style={styles.rowContainer}>
      {/* Tarjeta Principal del Producto */}
      <View style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: isDarkMode ? colors.border : "transparent",
          borderWidth: isDarkMode ? 1 : 0,
        },
        showDelete && styles.cardContainerWithDelete
      ]}>
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
          <Text style={[styles.name, { color: colors.text }]}>
            {item.nombre}
          </Text>
          <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>

        {/* Contador */}
        <View style={[styles.counterContainer, { backgroundColor: colors.box }]}>
          <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
            <Text style={styles.counterButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={[styles.counterValue, { color: colors.text }]}>
            {cantidad}
          </Text>

          <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Renderizado Condicional: El tacho SOLO aparece si showDelete es true */}
      {showDelete && (
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

CarritoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    cantidad: PropTypes.number,
    img_url: PropTypes.any,
    image: PropTypes.any,
    descripcion: PropTypes.string,
    desc: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
};

export default CarritoItem;