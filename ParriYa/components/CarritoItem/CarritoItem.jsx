import React, { useState, useEffect } from "react"; // <-- IMPORTANTE: Sumamos useState y useEffect
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./CarritoItem.styles";

const CarritoItem = ({ item, onRemove, onIncrement, onDecrement }) => {
  const cantidad = item.cantidad ?? 1;
  const imageSource = item.img_url || item.image;
  const description = item.descripcion || item.desc || '';

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
      {/* Tarjeta Principal del Producto (Le sumamos un estilo condicional si está el tacho activo) */}
      <View style={[styles.cardContainer, showDelete && styles.cardContainerWithDelete]}>
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
          {/* Cambiamos el onPress para usar nuestra nueva función intermedia */}
          <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
            <Text style={styles.counterButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.counterValue}>{cantidad}</Text>

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

export default CarritoItem;