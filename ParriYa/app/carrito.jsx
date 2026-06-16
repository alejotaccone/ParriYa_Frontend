import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CarritoItem from "../components/CarritoItem/CarritoItem";
import { useCart } from "../components/CartContext";
import { styles } from "../components/Carrito/carrito.styles";
import api, { resolveProductImg } from "../services/api";
import { useTheme } from "../components/ThemeContext";
import { COLORS } from "../constants/colors";

export default function CarritoScreen() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, addToCart } = useCart();
  const [sugerencias, setSugerencias] = useState([]);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    async function loadSugerencias() {
      try {
        const response = await api.get('/productos');
        if (response.data && response.data.length > 0) {
          const mapped = response.data.slice(0, 3).map((p) => ({
            id: String(p.id),
            nombre: p.nombre,
            image: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
          }));
          setSugerencias(mapped);
        }
      } catch (error) {
        console.warn('Error cargando sugerencias en carrito:', error.message);
      }
    }
    loadSugerencias();
  }, []);

  const tarifaServicio = 3000;

  const subtotalProductos = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalFinal = subtotalProductos > 0 ? subtotalProductos + tarifaServicio : 0;

  const renderSugerencia = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.suggestionCard,
        {
          backgroundColor: colors.card,
          borderColor: isDarkMode ? colors.border : COLORS.borderLight,
          borderWidth: 1,
        }
      ]}
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/detalle', params: { idProducto: item.id } })}
    >
      <View style={styles.suggestionImageContainer}>
        <Image
          source={item.image}
          style={styles.suggestionImage}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.suggestionName, { color: colors.text }]} numberOfLines={1}>
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundGray }]}>
      {/* Header Personalizado Naranja */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/categoria')}
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
          <Text style={[styles.deliveryMethod, { color: colors.text }]}>
            Retiro en el local
          </Text>
          <Text style={[styles.deliveryTime, { color: colors.textMuted }]}>
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
                onDecrement={() => {
                  if (item.cantidad > 1) {
                    updateQuantity(item.id, item.cantidad - 1);
                  }
                }}
              />
            ))
          ) : (
            <Text style={[styles.emptyCartText, { color: colors.textMuted }]}>
              Tu carrito está vacío. ¡Agregá algo rico!
            </Text>
          )}
        </View>

        {/* Sección Carrusel: */}
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
            ¿Queres agregar algo mas?
          </Text>
          <FlatList
            data={sugerencias}
            renderItem={renderSugerencia}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
          />
        </View>

        {/* Resumen de Costos Fijo Inferior */}
        <View style={[
          styles.resumenContainer,
          {
            backgroundColor: colors.card,
            borderTopColor: isDarkMode ? colors.border : "transparent",
            borderTopWidth: isDarkMode ? 1 : 0,
          }
        ]}>
          <Text style={[styles.resumenTitle, { color: colors.text }]}>Resumen</Text>

          <View style={styles.resumenRow}>
            <Text style={[styles.resumenLabel, { color: colors.textMuted }]}>Productos</Text>
            <Text style={[styles.resumenValue, { color: colors.text }]}>
              ${subtotalProductos.toLocaleString("es-AR")}
            </Text>
          </View>

          <View style={styles.resumenRow}>
            <Text style={[styles.resumenLabel, { color: colors.textMuted }]}>Tarifa de servicio</Text>
            <Text style={[styles.resumenValue, { color: colors.text }]}>
              $
              {subtotalProductos > 0
                ? tarifaServicio.toLocaleString("es-AR")
                : "0"}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.subtotalRow}>
            <Text style={[styles.subtotalLabel, { color: colors.text }]}>Subtotal</Text>
            <Text style={[styles.subtotalValue, { color: colors.text }]}>
              ${totalFinal.toLocaleString("es-AR")}
            </Text>
          </View>

          {/* Botón Ir a pagar */}
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.8}
            onPress={() => router.push('/pago')}
          >
            <Text style={styles.payButtonText}>Ir a pagar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
