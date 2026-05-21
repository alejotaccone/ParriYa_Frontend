import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CarritoItem from "../../components/CarritoItem/CarritoItem";
import { styles } from "./carrito.styles";

// Mocks iniciales basados en tu captura
const PRODUCTOS_INICIALES = [
  {
    id: "1",
    nombre: "Chorizo",
    desc: "Chorizo puro cerdo",
    precio: 5000,
    image: require("../../assets/images/prod_chori.png"),
  },
  {
    id: "2",
    nombre: "Lomo vacuno",
    desc: "Punto: Jugoso",
    precio: 20000,
    image: require("../../assets/images/prod_lomo.png"),
  },
];

const SUGERENCIAS_DATA = [
  {
    id: "10",
    nombre: "Coca-Cola 1.5lt",
    image: require("../../assets/images/prod_coca.png"),
  },
  {
    id: "11",
    nombre: "Coca-Cola Zero 1.5lt",
    image: require("../../assets/images/prod_cocazero.png"),
  },
  {
    id: "12",
    nombre: "Sprite 1.5lt",
    image: require("../../assets/images/prod_sprite.png"),
  },
];

export default function CarritoScreen() {
  const router = useRouter();
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);

  const tarifaServicio = 3000;

  // Función para eliminar un producto de la lista (se dispara al tocar el tacho naranja)
  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  // Calculamos el subtotal de los productos que queden en la lista
  const subtotalProductos = productos.reduce((sum, p) => sum + p.precio, 0);
  const totalFinal =
    subtotalProductos > 0 ? subtotalProductos + tarifaServicio : 0;

  // El renderizador de la sugerencia individual, limpio y sin listas anidadas
  const renderSugerencia = ({ item }) => (
    <TouchableOpacity style={styles.suggestionCard} activeOpacity={0.8}>
      <View style={styles.suggestionImageContainer}>
        <Image
          source={item.image}
          style={styles.suggestionImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.suggestionName} numberOfLines={1}>
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Personalizado Naranja */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu carrito</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info de Retiro */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryMethod}>Retiro en el local</Text>
          <Text style={styles.deliveryTime}>
            Tiempo estimado de preparacion: 15 - 30mins
          </Text>
        </View>

        {/* Lista de Productos Agregados */}
        <View style={styles.productsList}>
          {productos.length > 0 ? (
            productos.map((item) => (
              <CarritoItem
                key={item.id}
                item={item}
                onRemove={eliminarProducto}
              />
            ))
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: "#8E8E93",
                marginVertical: 30,
              }}
            >
              Tu carrito está vacío. ¡Agregá algo rico!
            </Text>
          )}
        </View>

        {/* Sección Carrusel: ¿Querés agregar algo más? */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>¿Queres agregar algo mas?</Text>
          <FlatList
            data={SUGERENCIAS_DATA}
            renderItem={renderSugerencia} // Ahora sí apunta a la función limpia
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
          />
        </View>

        {/* Resumen de Costos Fijo Inferior */}
        <View style={styles.resumenContainer}>
          <Text style={styles.resumenTitle}>Resumen</Text>

          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Productos</Text>
            <Text style={styles.resumenValue}>
              ${subtotalProductos.toLocaleString("es-AR")}
            </Text>
          </View>

          <View style={styles.resumenRow}>
            <Text style={styles.resumenLabel}>Tarifa de servicio</Text>
            <Text style={styles.resumenValue}>
              $
              {subtotalProductos > 0
                ? tarifaServicio.toLocaleString("es-AR")
                : "0"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>
              ${totalFinal.toLocaleString("es-AR")}
            </Text>
          </View>

          <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
            <Text style={styles.payButtonText}>Ir a pagar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
