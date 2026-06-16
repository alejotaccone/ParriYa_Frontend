import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api from '../../services/api';


function normalizeStatus(estado = '') {
  const s = estado.toLowerCase();
  if (s === 'pendiente' || s === 'recibido') return 'recibido';
  if (s === 'preparando' || s === 'en preparación' || s === 'en preparacion') return 'preparando';
  if (s === 'listo' || s === 'listo para retirar') return 'listo';
  if (s === 'finalizado' || s === 'entregado') return 'finalizado';
  return 'recibido';
}


const STATUS_BUTTONS = [
  {
    key: 'recibido',
    label: 'Recibido (Pendiente)',
    value: 'Pendiente',
    icon: 'checkmark-circle',
    iconSize: 20,
    activeStyle: 'statusBtnActiveRecibido',
    activeTextStyle: 'statusBtnTextActiveRecibido',
    activeColor: '#555555',
  },
  {
    key: 'preparando',
    label: 'Preparando (En cocina)',
    value: 'Preparando',
    icon: 'play-circle',
    iconSize: 20,
    activeStyle: 'statusBtnActivePreparando',
    activeTextStyle: 'statusBtnTextActivePreparando',
    activeColor: '#E76F41',
  },
  {
    key: 'listo',
    label: 'Listo para retirar',
    value: 'Listo',
    icon: 'restaurant',
    iconSize: 18,
    activeStyle: 'statusBtnActiveListo',
    activeTextStyle: 'statusBtnTextActiveListo',
    activeColor: '#00A89F',
  },
  {
    key: 'finalizado',
    label: 'Finalizado (Entregado)',
    value: 'Finalizado',
    icon: 'ribbon',
    iconSize: 20,
    activeStyle: 'statusBtnActiveFinalizado',
    activeTextStyle: 'statusBtnTextActiveFinalizado',
    activeColor: '#3D8C1A',
  },
];


const BADGE_STYLE_MAP = {
  finalizado: { badge: 'statusBadgeFinalizado', text: 'statusBadgeTextFinalizado' },
  listo:      { badge: 'statusBadgeListo',      text: 'statusBadgeTextListo'      },
  preparando: { badge: 'statusBadgePreparando', text: 'statusBadgeTextPreparando' },
  recibido:   { badge: 'statusBadgeRecibido',   text: 'statusBadgeTextRecibido'   },
};

export default function BackofficePedidos() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const loadOrders = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

      const response = await api.get('/pedidos');
      if (response.data && response.data.length > 0) {
        const formatted = response.data.map((o) => ({
          id: o.id.toString().padStart(3, '0'),
          rawId: o.id,
          cliente: o.nombreUsuario || 'Cliente',
          cantidad_productos: (o.detalles || []).reduce((sum, det) => sum + det.cantidad, 0),
          items: (o.detalles || []).map((item) => ({
            nombre: item.nombreProducto || 'Producto',
            cantidad: item.cantidad || 1,
            precio: item.subtotal || 0,
          })),
          total: o.total,
          estado: o.estado || 'Recibido',
        }));
        setOrders(formatted);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.warn('Error cargando pedidos en Backoffice del backend:', error.message);
      setOrders([]);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    loadOrders();


    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadOrders);
    return unsubscribe;
  }, [navigation]);


  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.estado);
    setModalVisible(true);
  };


  const handleConfirmStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await api.put(`/pedidos/${selectedOrder.rawId}/estado?nuevoEstado=${selectedStatus}`);
      setModalVisible(false);
      loadOrders();
      Alert.alert('Estado actualizado', `Se cambió el estado del pedido #${selectedOrder.id} a "${selectedStatus}".`);
    } catch (error) {
      console.error('Error al actualizar estado en el backend:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo guardar el nuevo estado en el servidor.');
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- HEADER ORANGE CON BOTÓN VOLVER --- */}
      <View style={styles.header}>
        <View style={styles.backHeaderRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.backHeaderTitle}>Pedidos</Text>
        </View>
      </View>

      {/* --- RECIENTES BANNER --- */}
      <View style={[styles.recientesBanner, { backgroundColor: isDarkMode ? colors.card : COLORS.borderMedium }]}>
        <Text style={[styles.recientesText, { color: colors.text }]}>Recientes</Text>
        <Text style={[styles.ultimos7DiasText, { color: colors.textMuted }]}>(Ultimos 7 dias)</Text>
      </View>

      {/* --- LISTADO DE DETALLE DE PEDIDOS --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {orders.map((order) => {
          const statusKey = normalizeStatus(order.estado);
          const badgeStyles = BADGE_STYLE_MAP[statusKey];
          
          return (
            <TouchableOpacity 
              key={order.id} 
              style={[
                styles.orderDetailCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isDarkMode ? colors.border : 'transparent',
                  borderWidth: isDarkMode ? 1 : 0,
                }
              ]}
              activeOpacity={0.8}
              onPress={() => handleOpenStatusModal(order)}
            >
              
              {/* Header de la tarjeta */}
              <View style={styles.orderCardHeader}>
                <Text style={[styles.orderIdText, { color: colors.text }]}>Nro pedido: {order.id}</Text>
                
                {/* Badge Visual del Estado de Preparación */}
                <View style={[styles.statusBadge, styles[badgeStyles.badge]]}>
                  <Text style={styles[badgeStyles.text]}>
                    {order.estado}
                  </Text>
                </View>

                <Text style={styles.orderClientName}>{order.cliente}</Text>
              </View>

              {/* Subtítulo cantidad de productos */}
              <Text style={[styles.orderQtyLabel, { color: colors.textMuted }]}>
                Cantidad de productos: {order.cantidad_productos}
              </Text>

              {/* Listado de items del pedido */}
              {order.items.map((item) => (
                <View key={item.nombre} style={styles.orderItemRow}>
                  <Text style={[styles.orderItemName, { color: colors.text }]}>{item.nombre}</Text>
                  <View style={styles.orderItemRight}>
                    <Text style={[styles.orderItemQty, { color: colors.textMuted }]}>x{item.cantidad}</Text>
                    <Text style={[styles.orderItemPrice, { color: colors.text }]}>
                      ${item.precio.toLocaleString('es-AR')}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Total Row */}
              <View style={[styles.orderTotalRow, { borderTopColor: isDarkMode ? colors.border : '#F0F0F0' }]}>
                <Text style={[styles.orderTotalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.orderTotalPrice, { color: colors.text }]}>
                  ${order.total.toLocaleString('es-AR')}
                </Text>
              </View>

            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* --- CUSTOM POPUP MODAL (CONTROL DE ESTADOS) --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
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
            
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Pedido #{selectedOrder?.id}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Subtítulo: Cliente */}
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>Cliente: {selectedOrder?.cliente}</Text>

            {/* Listado scrollable de los productos del pedido */}
            <View style={[styles.modalItemsList, { borderBottomColor: isDarkMode ? colors.border : '#F0F0F0' }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedOrder?.items.map((item) => (
                  <View key={item.nombre} style={styles.modalItemRow}>
                    <Text style={[styles.modalItemText, { color: colors.textMuted }]}>{item.nombre}</Text>
                    <Text style={[styles.modalItemText, { color: colors.textMuted }]}>x{item.cantidad} - ${item.precio.toLocaleString('es-AR')}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Opciones de Selección de Estado */}
            <Text style={[styles.statusOptionsTitle, { color: colors.text }]}>Actualizar Estado</Text>

            {/* Renderizado iterativo de botones de estado */}
            {STATUS_BUTTONS.map((btn) => {
              const isActive = normalizeStatus(selectedStatus) === btn.key;
              let iconColor = '#E5E5EA';
              if (isActive) {
                iconColor = btn.activeColor;
              } else if (isDarkMode) {
                iconColor = colors.border;
              }
              return (
                <TouchableOpacity
                  key={btn.key}
                  style={[
                    styles.statusOptionButton,
                    isActive
                      ? styles[btn.activeStyle]
                      : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }],
                  ]}
                  onPress={() => setSelectedStatus(btn.value)}
                >
                  <Ionicons
                    name={btn.icon}
                    size={btn.iconSize}
                    color={iconColor}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      isDarkMode && { color: colors.textMuted },
                      isActive && styles[btn.activeTextStyle],
                    ]}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Botón de Confirmación final */}
            <TouchableOpacity
              style={styles.modalConfirmButton}
              activeOpacity={0.8}
              onPress={handleConfirmStatus}
            >
              <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => router.replace('/backoffice')}
        >
          <Ionicons name="home" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/backoffice/productos')}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/backoffice/perfil')}
        >
          <Ionicons name="person" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
