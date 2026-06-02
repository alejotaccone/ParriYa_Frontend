import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTOS } from '../constants/mocks';
import { useCart } from '../components/CartContext';
import { styles } from '../components/Pago/pago.styles';

const SUGERENCIAS_MOCK = PRODUCTOS.slice(0, 3).map(p => ({
  id: p.id,
  nombre: p.nombre,
  image: p.img_url,
}));

export default function PagoScreen() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [metodoPago, setMetodoPago] = useState('mercado_pago');
  const [guardarDatos, setGuardarDatos] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

      const activeUser = JSON.parse(storedUser);
      const existingOrdersJson = await AsyncStorage.getItem('orders');
      const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
      const nextOrderId = existingOrders.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1;
      const fecha_pedido = new Date();
      const formattedDate = `${fecha_pedido.getDate().toString().padStart(2, '0')}/${(fecha_pedido.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${fecha_pedido.getFullYear()}`;

      const newOrder = {
        id: nextOrderId,
        usuario: activeUser.username || activeUser.email || 'anonimo',
        fecha_pedido: formattedDate,
        estado: 'Pendiente',
        metodo_pago: metodoPago === 'efectivo' ? 'Efectivo' : 'Mercado Pago',
        total,
        tarifa_servicio: tarifaServicio,
        subtotal,
        cantidad_productos: cartItems.reduce((sum, item) => sum + item.cantidad, 0),
        items: cartItems.map((item) => ({
          id: item.id,
          producto_nombre: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        })),
      };

      await AsyncStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
      clearCart();
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error guardando pedido:', error);
      Alert.alert('Error', 'No se pudo guardar el pedido. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* El ScrollView ahora es el contenedor principal blanco */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Botón Volver arriba de todo */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#4B2610" />
        </TouchableOpacity>

        {/* Sección Resumen */}
        <Text style={styles.sectionTitle}>Resumen</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.resumenText}>Tu carrito está vacío.</Text>
        ) : (
          cartItems.map(item => (
            <View key={item.id} style={styles.resumenRow}>
              <Text style={styles.resumenText}>{item.nombre}</Text>
              <View style={styles.resumenRight}>
                <Text style={styles.resumenQty}>x{item.cantidad}</Text>
                <Text style={styles.resumenPrice}>${(item.precio * item.cantidad).toLocaleString('es-AR')}</Text>
              </View>
            </View>
          ))
        )}
        <View style={[styles.resumenRow, { marginTop: 20 }]}> 
          <Text style={styles.resumenText}>Tarifa de servicio</Text>
          <Text style={styles.resumenPrice}>${tarifaServicio.toLocaleString('es-AR')}</Text>
        </View>

        {/* Sección Métodos de Pago */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Metodos de pago</Text>
        
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
            <View style={styles.cardIconWrapper}>
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
          <Text style={styles.checkboxText}>Guardar datos para futuras compras</Text>
        </TouchableOpacity>

        {/* Sección ¿Te olvidaste algo? */}
        <Text style={styles.sectionTitle}>¿Te olvidaste algo?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {SUGERENCIAS_MOCK.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionCard}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/detalle', params: { idProducto: item.id } })}
            >
              <Image source={item.image} style={styles.suggestionImage} resizeMode="contain" />
              <Text style={styles.suggestionName} numberOfLines={1}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Footer de Pago Fijo Abajo */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>
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
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="checkmark" size={36} color="white" />
            </View>
            <Text style={styles.modalTitle}>Pedido confirmado!</Text>
            <Text style={styles.modalSubtitle}>
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