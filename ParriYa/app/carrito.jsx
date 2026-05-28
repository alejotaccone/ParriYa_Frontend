import React from "react";
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
import CarritoItem from "../components/CarritoItem/CarritoItem";
import { PRODUCTOS } from "../constants/mocks";
import { useCart } from "../components/CartContext";
import { styles } from "../components/Carrito/carrito.styles";

const SUGERENCIAS_DATA = PRODUCTOS.filter((p) => ['10', '11', '12'].includes(p.id)).map((p) => ({
  id: p.id,
  nombre: p.nombre,
  image: p.img_url,
}));

export default function CarritoScreen() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const tarifaServicio = 3000;

  const subtotalProductos = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalFinal = subtotalProductos > 0 ? subtotalProductos + tarifaServicio : 0;

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
          onPress={() => router.replace('/')}
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
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CarritoItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onIncrement={() => updateQuantity(item.id, item.cantidad + 1)}
                onDecrement={() => updateQuantity(item.id, item.cantidad - 1)}
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

        {/* Sección Carrusel:  */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>¿Queres agregar algo mas?</Text>
          <FlatList
            data={SUGERENCIAS_DATA}
            renderItem={renderSugerencia} 
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

          {/* Botón Ir a pagar actualizado */}
          <TouchableOpacity 
            style={styles.payButton} 
            activeOpacity={0.8}
            onPress={() => router.push('/pago')} // <--- MAGIA ACÁ
          >
            <Text style={styles.payButtonText}>Ir a pagar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
