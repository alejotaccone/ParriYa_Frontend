import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api from '../../services/api';

// --- MOCK DETAILS FROM THE IMAGE FOR SEEDING ---
const PEDIDOS_DETALLE_MOCK = [
  {
    id: '023',
    cliente: 'Enzo Mussi',
    cantidad_productos: 2,
    items: [
      { nombre: 'Lomo vacuno', cantidad: 1, precio: 20000 },
      { nombre: 'Chorizo', cantidad: 1, precio: 5000 },
    ],
    total: 25000,
  },
  {
    id: '022',
    cliente: 'Luis Diaz',
    cantidad_productos: 2,
    items: [
      { nombre: 'Lomo vacuno', cantidad: 1, precio: 20000 },
      { nombre: 'Papas fritas', cantidad: 1, precio: 7000 },
    ],
    total: 27000,
  },
  {
    id: '021',
    cliente: 'Manuel Neuer',
    cantidad_productos: 2,
    items: [
      { nombre: 'Ribs de cerdo', cantidad: 1, precio: 20000 },
      { nombre: 'Chorizo', cantidad: 2, precio: 10000 },
    ],
    total: 30000,
  },
  {
    id: '020',
    cliente: 'Luis Jara',
    cantidad_productos: 2,
    items: [
      { nombre: 'Bondiola', cantidad: 1, precio: 20000 },
      { nombre: 'Ensalada mixta', cantidad: 1, precio: 5000 },
    ],
    total: 25000,
  },
  {
    id: '019',
    cliente: 'Bruno Titos',
    cantidad_productos: 2,
    items: [
      { nombre: 'Lomo vacuno', cantidad: 2, precio: 40000 },
      { nombre: 'Chorizo', cantidad: 1, precio: 5000 },
    ],
    total: 45000,
  },
];

export default function BackofficePedidos() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  
  // Estados para controlar la ventana emergente de edición
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Carga los pedidos reales del Backend
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

    // Refresco automático cada 10 segundos
    const interval = setInterval(() => {
      loadOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    return unsubscribe;
  }, [navigation]);

  // Función para abrir el modal personalizado
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.estado);
    setModalVisible(true);
  };

  // Función que persiste el nuevo estado en el Backend
  const handleConfirmStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await api.put(`/pedidos/${selectedOrder.rawId}/estado?nuevoEstado=${selectedStatus}`);
      setModalVisible(false);
      loadOrders(); // Recargar datos
      Alert.alert('Estado actualizado', `Se cambió el estado del pedido #${selectedOrder.id} a "${selectedStatus}".`);
    } catch (error) {
      console.error('Error al actualizar estado en el backend:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo guardar el nuevo estado en el servidor.');
    }
  };

  // Función para desloguear
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir del panel de administración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('activeUser');
            router.replace('/login');
          },
        },
      ]
    );
  };

  // Función interactiva (+) para simular operaciones
  const handleQuickAction = () => {
    Alert.alert(
      'Acciones del Administrador',
      'Simula operaciones en tiempo real para verificar el flujo de la base de datos local:',
      [
        {
          text: 'Simular nuevo Pedido',
          onPress: async () => {
            try {
              const currentOrdersJson = await AsyncStorage.getItem('orders');
              const currentOrders = currentOrdersJson ? JSON.parse(currentOrdersJson) : [];
              const nextId = currentOrders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
              
              const simulatedOrder = {
                id: nextId,
                usuario: 'Enzo Mussi',
                fecha_pedido: '02/06/2026',
                estado: 'Preparando',
                metodo_pago: 'Mercado Pago',
                total: 25000,
                tarifa_servicio: 3000,
                subtotal: 22000,
                cantidad_productos: 2,
                items: [
                  { producto_nombre: 'Lomo vacuno', cantidad: 1, subtotal: 20000 },
                  { producto_nombre: 'Chorizo', cantidad: 1, subtotal: 5000 },
                ],
              };

              await AsyncStorage.setItem('orders', JSON.stringify([simulatedOrder, ...currentOrders]));
              loadOrders();
              Alert.alert('Simulación exitosa', `Se añadió el pedido #${nextId.toString().padStart(3, '0')} con sus productos.`);
            } catch (e) {
              console.error(e);
            }
          },
        },
        {
          text: 'Simular nueva Reserva',
          onPress: async () => {
            try {
              const currentReservasJson = await AsyncStorage.getItem('reservas');
              const currentReservas = currentReservasJson ? JSON.parse(currentReservasJson) : [];
              
              const simulatedReserva = {
                id: Date.now().toString(),
                cantidad: 4,
                estado: 'Confirmada',
                fecha: '27/04/2026',
                horario: '21:30',
                cliente: 'Luis Diaz',
                turno: 'Noche',
                nombreDia: 'Lunes 27 de abril',
                diaSemana: 'Lunes',
                nroDia: '27',
              };

              await AsyncStorage.setItem('reservas', JSON.stringify([simulatedReserva, ...currentReservas]));
              Alert.alert('Simulación exitosa', `Se añadió la reserva de "${simulatedReserva.cliente}" en la base de datos.`);
            } catch (e) {
              console.error(e);
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
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
      <View style={[styles.recientesBanner, { backgroundColor: isDarkMode ? colors.card : '#EEEEEE' }]}>
        <Text style={[styles.recientesText, { color: colors.text }]}>Recientes</Text>
        <Text style={[styles.ultimos7DiasText, { color: colors.textMuted }]}>(Ultimos 7 dias)</Text>
      </View>

      {/* --- LISTADO DE DETALLE DE PEDIDOS --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {orders.map((order, orderIndex) => {
          const status = order.estado ? order.estado.toLowerCase() : '';
          
          return (
            <TouchableOpacity 
              key={order.id + orderIndex} 
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
                <View
                  style={[
                    styles.statusBadge,
                    status === 'finalizado' || status === 'entregado' ? styles.statusBadgeFinalizado :
                    status === 'listo' || status === 'listo para retirar' ? styles.statusBadgeListo :
                    status === 'preparando' || status === 'en preparación' || status === 'en preparacion' ? styles.statusBadgePreparando :
                    styles.statusBadgeRecibido
                  ]}
                >
                  <Text
                    style={
                      status === 'finalizado' || status === 'entregado' ? styles.statusBadgeTextFinalizado :
                      status === 'listo' || status === 'listo para retirar' ? styles.statusBadgeTextListo :
                      status === 'preparando' || status === 'en preparación' || status === 'en preparacion' ? styles.statusBadgeTextPreparando :
                      styles.statusBadgeTextRecibido
                    }
                  >
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
              {order.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.orderItemRow}>
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
                {selectedOrder?.items.map((item, index) => (
                  <View key={index} style={styles.modalItemRow}>
                    <Text style={[styles.modalItemText, { color: colors.textMuted }]}>{item.nombre}</Text>
                    <Text style={[styles.modalItemText, { color: colors.textMuted }]}>x{item.cantidad} - ${item.precio.toLocaleString('es-AR')}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Opciones de Selección de Estado */}
            <Text style={[styles.statusOptionsTitle, { color: colors.text }]}>Actualizar Estado</Text>

            {/* 1. Estado: Recibido */}
            <TouchableOpacity
              style={[
                styles.statusOptionButton,
                selectedStatus === 'Pendiente' || selectedStatus === 'Recibido' 
                  ? styles.statusBtnActiveRecibido 
                  : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }]
              ]}
              onPress={() => setSelectedStatus('Pendiente')}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={selectedStatus === 'Pendiente' || selectedStatus === 'Recibido' ? '#555555' : (isDarkMode ? colors.border : '#E5E5EA')} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
                  isDarkMode && { color: colors.textMuted },
                  (selectedStatus === 'Pendiente' || selectedStatus === 'Recibido') && styles.statusBtnTextActiveRecibido
                ]}
              >
                Recibido (Pendiente)
              </Text>
            </TouchableOpacity>

            {/* 2. Estado: Preparando */}
            <TouchableOpacity
              style={[
                styles.statusOptionButton,
                selectedStatus === 'Preparando' || selectedStatus === 'En preparación' || selectedStatus === 'En preparacion'
                  ? styles.statusBtnActivePreparando 
                  : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }]
              ]}
              onPress={() => setSelectedStatus('Preparando')}
            >
              <Ionicons 
                name="play-circle" 
                size={20} 
                color={selectedStatus === 'Preparando' || selectedStatus === 'En preparación' || selectedStatus === 'En preparacion' ? '#E76F41' : (isDarkMode ? colors.border : '#E5E5EA')} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
                  isDarkMode && { color: colors.textMuted },
                  (selectedStatus === 'Preparando' || selectedStatus === 'En preparación' || selectedStatus === 'En preparacion') && styles.statusBtnTextActivePreparando
                ]}
              >
                Preparando (En cocina)
              </Text>
            </TouchableOpacity>

            {/* 3. Estado: Listo */}
            <TouchableOpacity
              style={[
                styles.statusOptionButton,
                selectedStatus === 'Listo' || selectedStatus === 'Listo para retirar'
                  ? styles.statusBtnActiveListo 
                  : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }]
              ]}
              onPress={() => setSelectedStatus('Listo')}
            >
              <Ionicons 
                name="restaurant" 
                size={18} 
                color={selectedStatus === 'Listo' || selectedStatus === 'Listo para retirar' ? '#00A89F' : (isDarkMode ? colors.border : '#E5E5EA')} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
                  isDarkMode && { color: colors.textMuted },
                  (selectedStatus === 'Listo' || selectedStatus === 'Listo para retirar') && styles.statusBtnTextActiveListo
                ]}
              >
                Listo para retirar
              </Text>
            </TouchableOpacity>

            {/* 4. Estado: Finalizado */}
            <TouchableOpacity
              style={[
                styles.statusOptionButton,
                selectedStatus === 'Finalizado' || selectedStatus === 'Entregado'
                  ? styles.statusBtnActiveFinalizado 
                  : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }]
              ]}
              onPress={() => setSelectedStatus('Finalizado')}
            >
              <Ionicons 
                name="ribbon" 
                size={20} 
                color={selectedStatus === 'Finalizado' || selectedStatus === 'Entregado' ? '#3D8C1A' : (isDarkMode ? colors.border : '#E5E5EA')} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
                  isDarkMode && { color: colors.textMuted },
                  (selectedStatus === 'Finalizado' || selectedStatus === 'Entregado') && styles.statusBtnTextActiveFinalizado
                ]}
              >
                Finalizado (Entregado)
              </Text>
            </TouchableOpacity>

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
