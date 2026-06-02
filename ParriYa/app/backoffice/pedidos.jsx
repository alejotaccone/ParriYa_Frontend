import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';

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
  const [orders, setOrders] = useState([]);
  
  // Estados para controlar la ventana emergente de edición
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Carga y combina pedidos reales con los de diseño usando un Seeder local
  const loadOrders = async () => {
    try {
      const storedOrdersJson = await AsyncStorage.getItem('orders');
      let allOrders = [];

      if (storedOrdersJson) {
        allOrders = JSON.parse(storedOrdersJson);
      } else {
        // Sembrar datos iniciales si no hay nada en AsyncStorage
        // Esto permite que los mocks también sean editables en tiempo real
        const seedOrders = PEDIDOS_DETALLE_MOCK.map((o) => ({
          id: Number(o.id),
          usuario: o.cliente,
          fecha_pedido: '02/06/2026',
          estado: 'Entregado',
          metodo_pago: 'Mercado Pago',
          total: o.total,
          cantidad_productos: o.cantidad_productos,
          items: o.items.map((item, idx) => ({
            id: idx + 1,
            producto_nombre: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad,
          })),
        }));
        await AsyncStorage.setItem('orders', JSON.stringify(seedOrders));
        allOrders = seedOrders;
      }

      const formatted = allOrders.map((o) => ({
        id: o.id.toString().padStart(3, '0'),
        cliente: o.usuario.split('@')[0],
        cantidad_productos: o.cantidad_productos || 0,
        items: (o.items || []).map((item) => ({
          nombre: item.producto_nombre || 'Producto',
          cantidad: item.cantidad || 1,
          precio: item.subtotal || 0,
        })),
        total: o.total,
        estado: o.estado || 'Recibido',
      }));

      setOrders(formatted);
    } catch (error) {
      console.error('Error cargando pedidos en Backoffice:', error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Función para abrir el modal personalizado
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.estado);
    setModalVisible(true);
  };

  // Función que persiste el nuevo estado en el AsyncStorage local al confirmar
  const handleConfirmStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      const storedOrdersJson = await AsyncStorage.getItem('orders');
      if (storedOrdersJson) {
        const currentOrders = JSON.parse(storedOrdersJson);
        const updatedOrders = currentOrders.map((o) => {
          if (o.id.toString().padStart(3, '0') === selectedOrder.id) {
            return { ...o, estado: selectedStatus };
          }
          return o;
        });

        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        setModalVisible(false);
        loadOrders(); // Recargar datos
        Alert.alert('Estado actualizado', `Se cambió el estado del pedido #${selectedOrder.id} a "${selectedStatus}".`);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'No se pudo guardar el nuevo estado.');
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
                id: Date.now(),
                cantidad_de_personas: 4,
                estado: 'Confirmado',
                fecha_reserva: '02/06/2026',
                horario_de_reserva: '21:30',
                nombre_cliente: 'Luis Diaz',
                telefono_cliente: '1123456789',
                ubicacion: 'Salón Principal',
              };

              await AsyncStorage.setItem('reservas', JSON.stringify([simulatedReserva, ...currentReservas]));
              Alert.alert('Simulación exitosa', `Se añadió la reserva de "${simulatedReserva.nombre_cliente}" en la base de datos.`);
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
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

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
      <View style={styles.recientesBanner}>
        <Text style={styles.recientesText}>Recientes</Text>
        <Text style={styles.ultimos7DiasText}>(Ultimos 7 dias)</Text>
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
              style={styles.orderDetailCard}
              activeOpacity={0.8}
              onPress={() => handleOpenStatusModal(order)}
            >
              
              {/* Header de la tarjeta */}
              <View style={styles.orderCardHeader}>
                <Text style={styles.orderIdText}>Nro pedido: {order.id}</Text>
                
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
              <Text style={styles.orderQtyLabel}>
                Cantidad de productos: {order.cantidad_productos}
              </Text>

              {/* Listado de items del pedido */}
              {order.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.orderItemRow}>
                  <Text style={styles.orderItemName}>{item.nombre}</Text>
                  <View style={styles.orderItemRight}>
                    <Text style={styles.orderItemQty}>x{item.cantidad}</Text>
                    <Text style={styles.orderItemPrice}>
                      ${item.precio.toLocaleString('es-AR')}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Total Row */}
              <View style={styles.orderTotalRow}>
                <Text style={styles.orderTotalLabel}>Total</Text>
                <Text style={styles.orderTotalPrice}>
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
          <View style={styles.modalCard}>
            
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pedido #{selectedOrder?.id}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            {/* Subtítulo: Cliente */}
            <Text style={styles.modalSubtitle}>Cliente: {selectedOrder?.cliente}</Text>

            {/* Listado scrollable de los productos del pedido */}
            <View style={styles.modalItemsList}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedOrder?.items.map((item, index) => (
                  <View key={index} style={styles.modalItemRow}>
                    <Text style={styles.modalItemText}>{item.nombre}</Text>
                    <Text style={styles.modalItemText}>x{item.cantidad} - ${item.precio.toLocaleString('es-AR')}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Opciones de Selección de Estado */}
            <Text style={styles.statusOptionsTitle}>Actualizar Estado</Text>

            {/* 1. Estado: Recibido */}
            <TouchableOpacity
              style={[
                styles.statusOptionButton,
                selectedStatus === 'Pendiente' || selectedStatus === 'Recibido' 
                  ? styles.statusBtnActiveRecibido 
                  : styles.statusBtnInactive
              ]}
              onPress={() => setSelectedStatus('Pendiente')}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={selectedStatus === 'Pendiente' || selectedStatus === 'Recibido' ? '#555555' : '#E5E5EA'} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
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
                  : styles.statusBtnInactive
              ]}
              onPress={() => setSelectedStatus('Preparando')}
            >
              <Ionicons 
                name="play-circle" 
                size={20} 
                color={selectedStatus === 'Preparando' || selectedStatus === 'En preparación' || selectedStatus === 'En preparacion' ? '#E76F41' : '#E5E5EA'} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
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
                  : styles.statusBtnInactive
              ]}
              onPress={() => setSelectedStatus('Listo')}
            >
              <Ionicons 
                name="restaurant" 
                size={18} 
                color={selectedStatus === 'Listo' || selectedStatus === 'Listo para retirar' ? '#00A89F' : '#E5E5EA'} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
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
                  : styles.statusBtnInactive
              ]}
              onPress={() => setSelectedStatus('Finalizado')}
            >
              <Ionicons 
                name="ribbon" 
                size={20} 
                color={selectedStatus === 'Finalizado' || selectedStatus === 'Entregado' ? '#3D8C1A' : '#E5E5EA'} 
              />
              <Text 
                style={[
                  styles.statusBtnText,
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
          <Ionicons name="home" size={26} color="white" />
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
