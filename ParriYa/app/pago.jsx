import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useCart } from '../components/CartContext';
import { styles } from '../components/Pago/pago.styles';
import api, { resolveProductImg } from '../services/api';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

// ─── Helpers puros ────────────────────────────────────────────────
function buildOrderBody(cartItems, total, metodo) {
  return {
    horarioRetiro: '20:00:00',
    total,
    detalles: cartItems.map((item) => ({
      productoId: Number.parseInt(item.id, 10),
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    })),
    pagos: [{ metodo, monto: total }],
  };
}

// ─── Custom Hook ──────────────────────────────────────────────────
function usePagoLogic({ cartItems, total, clearCart, router }) {
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sugerencias, setSugerencias]     = useState([]);

  useEffect(() => {
    async function loadSugerencias() {
      try {
        const response = await api.get('/productos');
        if (response.data?.length > 0) {
          setSugerencias(
            response.data.slice(0, 3).map((p) => ({
              id: String(p.id),
              nombre: p.nombre,
              image: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
            }))
          );
        }
      } catch (error) {
        console.warn('Error cargando sugerencias en pago:', error.message);
      }
    }
    loadSugerencias();
  }, []);

  const processCashPayment = async () => {
    try {
      await api.post('/pedidos', buildOrderBody(cartItems, total, 'EFECTIVO'));
      clearCart();
      router.replace('/exito');
    } catch (error) {
      console.error('Error guardando pedido en efectivo en backend:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo registrar tu pedido en el servidor. Intenta de nuevo.');
    }
  };

  const initiateMercadoPago = async () => {
    try {
      const response = await api.post('/api/pagos/crear-preferencia', {
        monto: total,
        titulo: 'Pedido ParriYa!',
      });

      const initPoint = response.data.init_point;
      if (!initPoint) {
        Alert.alert('Error', 'No se recibió la URL de pago desde el servidor.');
        return;
      }

      const canOpen = await Linking.canOpenURL(initPoint);
      if (!canOpen) {
        Alert.alert('Error de Redirección', 'No se pudo abrir la pasarela de Mercado Pago. Verifica si tienes un navegador instalado.');
        return;
      }

      await Linking.openURL(initPoint);
      setPaymentStatus('processing');
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error generando preferencia de Mercado Pago:', error.response?.data || error.message);
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar el pago con Mercado Pago.');
    }
  };

  const handleConfirmMercadoPagoPayment = async () => {
    setIsSubmitting(true);
    try {
      const storedUser = await AsyncStorage.getItem('activeUser');
      if (!storedUser) {
        Alert.alert('Error', 'No se encontró una sesión activa.');
        return;
      }
      await api.post('/pedidos', buildOrderBody(cartItems, total, 'MERCADO_PAGO'));
      clearCart();
      setShowConfirmation(false);
      setPaymentStatus('idle');
      router.replace('/exito');
    } catch (error) {
      console.error('Error registrando pedido:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo registrar tu pedido. Por favor, verifica tu conexión e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePay = async (metodoPago) => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos para pagar.');
      return;
    }
    const storedUser = await AsyncStorage.getItem('activeUser');
    if (!storedUser) {
      Alert.alert('Debes iniciar sesión', 'Inicia sesión para guardar tu pedido.');
      return;
    }
    if (metodoPago === 'efectivo') {
      Alert.alert(
        'Confirmar Pedido',
        '¿Deseas confirmar la compra para retirar y pagar en efectivo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: processCashPayment },
        ]
      );
    } else {
      await initiateMercadoPago();
    }
  };

  const handleDismissModal = () => {
    if (!isSubmitting) {
      setShowConfirmation(false);
    }
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
    setPaymentStatus('idle');
  };

  return {
    paymentStatus,
    isSubmitting,
    showConfirmation,
    sugerencias,
    handlePay,
    handleConfirmMercadoPagoPayment,
    handleDismissModal,
    handleGoBack,
  };
}

// ─── Sub-componente: Modal de confirmación Mercado Pago ───────────
function PaymentConfirmationModal({
  visible,
  paymentStatus,
  isSubmitting,
  colors,
  isDarkMode,
  onConfirm,
  onDismiss,
  onGoBack,
  onGoHome,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalCard,
          {
            backgroundColor: colors.card,
            borderColor: isDarkMode ? colors.border : 'transparent',
            borderWidth: isDarkMode ? 1 : 0,
          }
        ]}>
          {paymentStatus === 'processing' ? (
            <>
              <View style={[styles.modalIconWrapper, { backgroundColor: 'transparent' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: 18, marginBottom: 15 }]}>
                Procesando tu pago en Mercado Pago...
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textMuted, fontSize: 14, marginBottom: 25 }]}>
                Una vez que hayas completado la transferencia en la aplicación de Mercado Pago, regresa aquí para finalizar tu orden.
              </Text>

              <TouchableOpacity
                style={[styles.modalButton, { width: '100%', alignItems: 'center' }]}
                activeOpacity={0.8}
                disabled={isSubmitting}
                onPress={onConfirm}
              >
                {isSubmitting
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={styles.modalButtonText}>Ya pagué</Text>
                }
              </TouchableOpacity>

              {!isSubmitting && (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: 'transparent', marginTop: 12, borderWidth: 1, borderColor: colors.border, width: '100%', alignItems: 'center' }]}
                  activeOpacity={0.8}
                  onPress={onGoBack}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Volver</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={styles.modalIconWrapper}>
                <Ionicons name="checkmark" size={36} color="white" />
              </View>
              <Text style={styles.modalTitle}>Pedido confirmado!</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                Tu pago fue aprobado. El recibo de compra será enviado a tu email.
              </Text>
              <TouchableOpacity style={styles.modalButton} activeOpacity={0.8} onPress={onGoHome}>
                <Text style={styles.modalButtonText}>Volver al Inicio</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

PaymentConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  paymentStatus: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    card: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    textMuted: PropTypes.string.isRequired,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onGoHome: PropTypes.func.isRequired,
};

// ─── Sub-componente: Métodos de Pago ─────────────────────────────
function PaymentMethodSelector({ metodoPago, onSelect, colors, isDarkMode }) {
  const isEfectivo = metodoPago === 'efectivo';
  const isMp       = metodoPago === 'mercado_pago';

  let cardIconBg = colors.card;
  if (isMp) {
    cardIconBg = isDarkMode ? '#303030' : COLORS.backgroundLight;
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.paymentMethodEfectivo,
          isEfectivo
            ? { borderWidth: 2, borderColor: '#FFFFFF' }
            : { backgroundColor: colors.box, borderWidth: 1, borderColor: colors.border },
        ]}
        activeOpacity={0.8}
        onPress={() => onSelect('efectivo')}
      >
        <View style={styles.paymentLeft}>
          <Ionicons name="cash-outline" size={28} color={isEfectivo ? 'white' : COLORS.efectivo} />
          <Text style={[styles.paymentText, { color: isEfectivo ? 'white' : colors.text }]}>
            Efectivo
          </Text>
        </View>
        <Ionicons
          name={isEfectivo ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={isEfectivo ? 'white' : colors.textMuted}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.paymentMethodTarjeta,
          isMp
            ? { borderWidth: 2, borderColor: '#FFFFFF' }
            : { backgroundColor: colors.box, borderWidth: 1, borderColor: colors.border },
        ]}
        activeOpacity={0.8}
        onPress={() => onSelect('mercado_pago')}
      >
        <View style={styles.paymentLeft}>
          <View style={[styles.cardIconWrapper, { backgroundColor: cardIconBg }]}>
            <Ionicons name="card" size={24} color={isMp ? '#FF5A2D' : colors.textMuted} />
          </View>
          <View>
            <Text style={[styles.paymentTextBold, { color: isMp ? 'white' : colors.text }]}>
              Tarjeta Mercado Pago
            </Text>
            <Text style={[styles.paymentSubtext, { color: isMp ? 'white' : colors.textMuted }]}>
              **** 0505
            </Text>
          </View>
        </View>
        <Ionicons
          name={isMp ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={isMp ? 'white' : colors.textMuted}
        />
      </TouchableOpacity>
    </>
  );
}

PaymentMethodSelector.propTypes = {
  metodoPago: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    card: PropTypes.string.isRequired,
    box: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    textMuted: PropTypes.string.isRequired,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

// ─── Componente Principal ─────────────────────────────────────────
export default function PagoScreen() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { colors, isDarkMode }   = useTheme();
  const [metodoPago, setMetodoPago]     = useState('mercado_pago');
  const [guardarDatos, setGuardarDatos] = useState(true);

  const tarifaServicio = 3000;
  const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total    = subtotal > 0 ? subtotal + tarifaServicio : 0;

  const {
    paymentStatus,
    isSubmitting,
    showConfirmation,
    sugerencias,
    handlePay,
    handleConfirmMercadoPagoPayment,
    handleDismissModal,
    handleGoBack,
  } = usePagoLogic({ cartItems, total, clearCart, router });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={isDarkMode ? 'white' : '#4B2610'} />
        </TouchableOpacity>

        {/* Resumen */}
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

        {/* Métodos de Pago */}
        <Text style={[styles.sectionTitle, { marginTop: 25, color: isDarkMode ? '#ffffff' : COLORS.secondary }]}>Metodos de pago</Text>
        <PaymentMethodSelector
          metodoPago={metodoPago}
          onSelect={setMetodoPago}
          colors={colors}
          isDarkMode={isDarkMode}
        />

        {/* Checkbox Guardar Datos */}
        <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.7} onPress={() => setGuardarDatos(!guardarDatos)}>
          <Ionicons name={guardarDatos ? 'checkbox' : 'square-outline'} size={22} color={guardarDatos ? '#E76F41' : '#8E8E93'} />
          <Text style={[styles.checkboxText, { color: colors.text }]}>Guardar datos para futuras compras</Text>
        </TouchableOpacity>

        {/* Sugerencias */}
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : COLORS.secondary }]}>¿Te olvidaste algo?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {sugerencias.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : COLORS.borderLight, borderWidth: 1 }]}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/detalle', params: { idProducto: item.id } })}
            >
              <Image source={item.image} style={styles.suggestionImage} resizeMode="contain" />
              <Text style={[styles.suggestionName, { color: colors.textMuted }]} numberOfLines={1}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.textMuted }]}>Total</Text>
          <Text style={[styles.footerTotal, { color: colors.text }]}>
            <Text style={styles.currencySymbol}>$ </Text>{total.toLocaleString('es-AR')}
          </Text>
        </View>
        <TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={() => handlePay(metodoPago)}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Mercado Pago */}
      <PaymentConfirmationModal
        visible={showConfirmation}
        paymentStatus={paymentStatus}
        isSubmitting={isSubmitting}
        colors={colors}
        isDarkMode={isDarkMode}
        onConfirm={handleConfirmMercadoPagoPayment}
        onDismiss={handleDismissModal}
        onGoBack={handleGoBack}
        onGoHome={() => {
          handleGoBack();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}