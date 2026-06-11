import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../components/CartContext';
import { styles } from '../components/Pago/pago.styles';
import api, { resolveProductImg } from '../services/api';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

export default function PagoScreen() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [metodoPago, setMetodoPago] = useState('mercado_pago');
  const [guardarDatos, setGuardarDatos] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
        console.warn('Error cargando sugerencias en pago:', error.message);
      }
    }
    loadSugerencias();
  }, []);

  const tarifaServicio = 3000;
  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total = subtotal > 0 ? subtotal + tarifaServicio : 0;

  const handlePay = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos para pagar.');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('activeUser');
      if (!storedUser) {
        Alert.alert('Debes iniciar sesión', 'Inicia sesión para guardar tu pedido.');
        return;
      }

      // Payload para el backend Spring Boot (PedidoRequest)
      const requestBody = {
        horarioRetiro: "20:00:00",
        total: total,
        detalles: cartItems.map((item) => ({
          productoId: parseInt(item.id, 10),
          cantidad: item.cantidad,
          precioUnitario: item.precio
        })),
        pagos: [
          {
            metodo: metodoPago === 'efectivo' ? 'EFECTIVO' : 'MERCADO_PAGO',
            monto: total
          }
        ]
      };

      await api.post('/pedidos', requestBody);
      clearCart();
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error guardando pedido en backend:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo procesar el pedido con el servidor. Intenta de nuevo.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* El ScrollView ahora es el contenedor principal blanco */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Botón Volver arriba de todo */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={isDarkMode ? "white" : "#4B2610"} />
        </TouchableOpacity>

        {/* Sección Resumen */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : COLORS.secondary }]}>Resumen</Text>
        {cartItems.length === 0 ? (
          <Text style={[styles.resumenText, { color: colors.textMuted }]}>Tu carrito está vacío.</Text>
        ) : (
          cartItems.map(item => (
            <View key={item.id} style={styles.resumenRow}>
              <Text style={[styles.resumenText, { color: colors.text }]}>{item.nombre}</Text>
              <View style={styles.resumenRight}>
                <Text style={[styles.resumenQty, { color: colors.textMuted }]}>x{item.cantidad}</Text>
                <Text style={[styles.resumenPrice, { color: colors.text }]}>${(item.precio * item.cantidad).toLocaleString('es-AR')}</Text>
              </View>
            </View>
          ))
        )}
        <View style={[styles.resumenRow, { marginTop: 20 }]}> 
          <Text style={[styles.resumenText, { color: colors.textMuted }]}>Tarifa de servicio</Text>
          <Text style={[styles.resumenPrice, { color: colors.text }]}>${tarifaServicio.toLocaleString('es-AR')}</Text>
        </View>

        {/* Sección Métodos de Pago */}
        <Text style={[styles.sectionTitle, { marginTop: 25, color: isDarkMode ? '#ffffff' : COLORS.secondary }]}>Metodos de pago</Text>
        
        {/* Opción Efectivo */}
        <TouchableOpacity 
          style={styles.paymentMethodEfectivo} 
          activeOpacity={0.8}
          onPress={() => setMetodoPago('efectivo')}
        >
          <View style={styles.paymentLeft}>
            <Ionicons name="cash-outline" size={28} color="white" />
            <Text style={styles.paymentText}>Efectivo</Text>
          </View>
          <Ionicons 
            name={metodoPago === 'efectivo' ? "radio-button-on" : "radio-button-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Opción Tarjeta Mercado Pago */}
        <TouchableOpacity 
          style={styles.paymentMethodTarjeta} 
          activeOpacity={0.8}
          onPress={() => setMetodoPago('mercado_pago')}
        >
          <View style={styles.paymentLeft}>
            <View style={[styles.cardIconWrapper, { backgroundColor: isDarkMode ? '#303030' : COLORS.backgroundLight }]}>
               <Ionicons name="card" size={24} color="#FF5A2D" /> 
            </View>
            <View>
              <Text style={styles.paymentTextBold}>Tarjeta Mercado Pago</Text>
              <Text style={styles.paymentSubtext}>**** 0505</Text>
            </View>
          </View>
          <Ionicons 
            name={metodoPago === 'mercado_pago' ? "radio-button-on" : "radio-button-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Checkbox Guardar Datos */}
        <TouchableOpacity 
          style={styles.checkboxRow} 
          activeOpacity={0.7}
          onPress={() => setGuardarDatos(!guardarDatos)}
        >
          <Ionicons 
            name={guardarDatos ? "checkbox" : "square-outline"} 
            size={22} 
            color={guardarDatos ? "#E76F41" : "#8E8E93"} 
          />
          <Text style={[styles.checkboxText, { color: colors.text }]}>Guardar datos para futuras compras</Text>
        </TouchableOpacity>

        {/* Sección ¿Te olvidaste algo? */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : COLORS.secondary }]}>¿Te olvidaste algo?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {sugerencias.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.suggestionCard, 
                { 
                  backgroundColor: colors.card, 
                  borderColor: isDarkMode ? colors.border : COLORS.borderLight,
                  borderWidth: 1
                }
              ]}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/detalle', params: { idProducto: item.id } })}
            >
              <Image source={item.image} style={styles.suggestionImage} resizeMode="contain" />
              <Text style={[styles.suggestionName, { color: colors.textMuted }]} numberOfLines={1}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Footer de Pago Fijo Abajo */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.textMuted }]}>Total</Text>
          <Text style={[styles.footerTotal, { color: colors.text }]}>
            <Text style={styles.currencySymbol}>$ </Text>{total.toLocaleString('es-AR')}
          </Text>
        </View>
        <TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : 'transparent', borderWidth: isDarkMode ? 1 : 0 }]}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="checkmark" size={36} color="white" />
            </View>
            <Text style={styles.modalTitle}>Pedido confirmado!</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
              Tu pago fue aprobado. El recibo de compra será enviado a tu email.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={() => {
                setShowConfirmation(false);
                clearCart();
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.modalButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}