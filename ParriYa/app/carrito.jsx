import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CarritoItem from "../components/CarritoItem/CarritoItem";
import { useCart } from "../components/CartContext";
import { styles } from "../components/Carrito/carrito.styles";
import api, { resolveProductImg } from "../services/api";
import { useTheme } from "../components/ThemeContext";
import { COLORS } from "../constants/colors";
import { logEvent } from "../services/analytics";

export default function CarritoScreen() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, retiroMode, setRetiroMode, retiroTime, setRetiroTime } = useCart();
  const [sugerencias, setSugerencias] = useState([]);
  const { colors, isDarkMode } = useTheme();
  const [showRetiroModal, setShowRetiroModal] = useState(false);
  
  // Estados temporales del modal
  const [tempRetiroMode, setTempRetiroMode] = useState('inmediato');
  const [tempSelectedSlot, setTempSelectedSlot] = useState(null);

  const abrirModal = () => {
    setTempRetiroMode(retiroMode);
    setTempSelectedSlot(retiroTime);
    setShowRetiroModal(true);
  };

  // Genera franjas horarias de 30 min a partir de la próxima media hora
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    let startMinutes = now.getHours() * 60 + now.getMinutes();
    // Redondear al próximo bloque de 30 min + 30 min de preparación
    startMinutes = Math.ceil(startMinutes / 30) * 30 + 30;

    for (let i = 0; i < 6; i++) {
      const fromMin = startMinutes + i * 30;
      const toMin = fromMin + 15;
      const fromH = String(Math.floor(fromMin / 60) % 24).padStart(2, '0');
      const fromM = String(fromMin % 60).padStart(2, '0');
      const toH = String(Math.floor(toMin / 60) % 24).padStart(2, '0');
      const toM = String(toMin % 60).padStart(2, '0');
      slots.push(`${fromH}:${fromM} - ${toH}:${toM}`);
    }
    return slots;
  };

  const getRetiroLabel = () => {
    if (retiroMode === 'programado' && retiroTime) {
      return `Retiro: ${retiroTime}`;
    }
    return 'Tiempo estimado: 15 - 30 mins';
  };

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

  const subtotalProductos = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalFinal = subtotalProductos;

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

  const isEmpty = cartItems.length === 0;

  return (
    <>
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

      {isEmpty ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="cart-outline" size={80} color={colors.textMuted} style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 10 }}>
            Tu carrito está vacío.
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 30 }}>
            ¡Agregá algo rico del menú para empezar!
          </Text>
          <TouchableOpacity
            style={[styles.payButton, { paddingHorizontal: 30 }]}
            activeOpacity={0.8}
            onPress={() => router.replace('/(tabs)/categoria')}
          >
            <Text style={styles.payButtonText}>Ver menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Info de Retiro */}
            <View style={{ paddingHorizontal: 20, marginVertical: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.deliveryMethod, { color: colors.text }]}>
                  Retiro en el local
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={abrirModal}
                >
                  <Text style={{ color: COLORS.primary, fontSize: 15, fontWeight: '600' }}>Programar</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.deliveryTime, { color: colors.textMuted, marginTop: 4 }]}>
                {getRetiroLabel()}
              </Text>
            </View>

            {/* Lista de Productos Agregados */}
            <View style={styles.productsList}>
              {cartItems.map((item) => (
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
              ))}

              {/* Botón Eliminar Todo */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={clearCart}
                style={{ alignSelf: 'flex-start' }}
              >
                <Text style={{ color: '#E76F41', fontSize: 15, fontWeight: '600' }}>Vaciar Carrito</Text>
              </TouchableOpacity>
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
          </ScrollView>

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
              onPress={() => {
                logEvent('begin_checkout', {
                  value: totalFinal,
                  currency: 'ARS',
                  number_of_items: cartItems.length,
                });
                router.push('/pago');
              }}
            >
              <Text style={styles.payButtonText}>Ir a pagar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>

      {/* Modal Horario de Retiro */}
      <Modal
        visible={showRetiroModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRetiroModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowRetiroModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{
              backgroundColor: isDarkMode ? COLORS.cardDark : '#FFFFFF',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              paddingHorizontal: 25,
              paddingTop: 20,
              paddingBottom: 40,
            }}>
              {/* Header del modal */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : COLORS.textMain }}>
                  Horario de retiro
                </Text>
                <TouchableOpacity onPress={() => setShowRetiroModal(false)}>
                  <Ionicons name="close" size={26} color={isDarkMode ? '#FFFFFF' : COLORS.textMain} />
                </TouchableOpacity>
              </View>

              {/* Opción: Cuando esté listo */}
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}
                activeOpacity={0.7}
                onPress={() => { setTempRetiroMode('inmediato'); setTempSelectedSlot(null); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Ionicons name="time-outline" size={22} color={isDarkMode ? '#CCCCCC' : COLORS.textMain} />
                  <Text style={{ fontSize: 16, color: isDarkMode ? '#FFFFFF' : COLORS.textMain }}>
                    Cuando esté listo (15-30 min)
                  </Text>
                </View>
                <Ionicons
                  name={tempRetiroMode === 'inmediato' ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={tempRetiroMode === 'inmediato' ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* Opción: Programar para después */}
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}
                activeOpacity={0.7}
                onPress={() => setTempRetiroMode('programado')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Ionicons name="calendar-outline" size={22} color={isDarkMode ? '#CCCCCC' : COLORS.textMain} />
                  <Text style={{ fontSize: 16, color: isDarkMode ? '#FFFFFF' : COLORS.textMain }}>
                    Programar para más tarde
                  </Text>
                </View>
                <Ionicons
                  name={tempRetiroMode === 'programado' ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={tempRetiroMode === 'programado' ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>

              {/* Franjas horarias (solo si es 'programado') */}
              {tempRetiroMode === 'programado' && (
                <View style={{ marginTop: 15 }}>
                  {generateTimeSlots().map((slot, index) => {
                    const isSelected = tempSelectedSlot === slot;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => setTempSelectedSlot(slot)}
                        style={{
                          backgroundColor: isSelected ? COLORS.primary : 'transparent',
                          borderWidth: isSelected ? 0 : 1,
                          borderColor: isDarkMode ? COLORS.borderDarkMode : COLORS.borderMedium,
                          borderRadius: 30,
                          paddingVertical: 12,
                          alignItems: 'center',
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{
                          fontSize: 16,
                          fontWeight: isSelected ? 'bold' : '500',
                          color: isSelected ? '#FFFFFF' : (isDarkMode ? '#CCCCCC' : COLORS.textMain),
                        }}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Botón Aplicar */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setRetiroMode(tempRetiroMode);
                  setRetiroTime(tempSelectedSlot);
                  setShowRetiroModal(false);
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 15,
                  paddingVertical: 15,
                  alignItems: 'center',
                  marginTop: 20,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
