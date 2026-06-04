import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

// --- DATOS MOCK ORIGINALES DE LA IMAGEN ---
const PEDIDOS_MOCK_DISENO = [
  { id: '023', cliente: 'Enzo Mussi', estado: 'Entregado', precio: 25000 },
  { id: '022', cliente: 'Luis Diaz', estado: 'Entregado', precio: 27000 },
  { id: '021', cliente: 'Manuel Neuer', estado: 'Entregado', precio: 30000 },
  { id: '020', cliente: 'Luisa Jara', estado: 'Entregado', precio: 25000 },
  { id: '019', cliente: 'Bruno Titos', estado: 'Entregado', precio: 45000 },
];

const RESERVAS_MOCK_DISENO = [
  { id: 1, horario: '21:30', cliente: 'Enzo Mussi', cantidad: 4 },
  { id: 2, horario: '20:30', cliente: 'Luis Diaz', cantidad: 6 },
  { id: 3, horario: '22:30', cliente: 'Luisa Jara', cantidad: 3 },
  { id: 4, horario: '22:30', cliente: 'Claudia Paz', cantidad: 3 },
];

const FEEDBACK_MOCK_DISENO = [
  { id: 1, cliente: 'Enzo Mussi', comentario: 'El lomo estaba en su punto, muy tierno.', calificacion: 4.2 },
  { id: 2, cliente: 'Luisa Jara', comentario: 'Las papas fritas muy crocantes, excelentes.', calificacion: 4.9 },
  { id: 3, cliente: 'Enzo Mussi', comentario: 'La tira de asado es un 10.', calificacion: 4.7 },
];

export default function BackofficeDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [feedback, setFeedback] = useState([]);

  // Carga los datos del Backoffice Dashboard desde la base de datos (Backend)
  const loadDashboardData = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

      // 1. Obtener Pedidos del Backend
      try {
        const pedRes = await api.get('/pedidos/dashboard');
        if (pedRes.data && pedRes.data.length > 0) {
          const mappedOrders = pedRes.data.map(o => ({
            id: String(o.id).padStart(3, '0'),
            cliente: o.nombreCliente || 'Cliente',
            estado: o.estado || 'Recibido',
            precio: o.precio || 0,
          }));
          setOrders(mappedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('Error fetching orders dashboard from backend:', err.message);
        setOrders([]);
      }

      // 2. Obtener Reservas del Backend
      try {
        const resRes = await api.get('/reservas/dashboard/hoy');
        if (resRes.data && resRes.data.length > 0) {
          const mappedReservas = resRes.data.map((r, idx) => ({
            id: `back_${idx}`,
            horario: String(r.horario || '').substring(0, 5),
            cliente: r.nombreCliente || 'Cliente',
            cantidad: r.cantidadPersonas || 2,
          }));
          setReservas(mappedReservas);
        } else {
          setReservas([]);
        }
      } catch (err) {
        console.warn('Error fetching reservations dashboard from backend:', err.message);
        setReservas([]);
      }

      // 3. Obtener Feedback del Backend
      try {
        const feedRes = await api.get('/feedback/recientes');
        if (feedRes.data && feedRes.data.length > 0) {
          const mappedFeedback = feedRes.data.map(f => ({
            id: String(f.id),
            cliente: f.nombreCliente || 'Cliente',
            comentario: f.comentario || '',
            calificacion: f.calificacion || 5.0,
          }));
          setFeedback(mappedFeedback);
        } else {
          setFeedback([]);
        }
      } catch (err) {
        console.warn('Error fetching feedback from backend:', err.message);
        setFeedback([]);
      }

    } catch (error) {
      console.error('Error cargando datos del Backoffice:', error);
      setOrders([]);
      setReservas([]);
      setFeedback([]);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    loadDashboardData();

    // Refresco automático cada 10 segundos para emular tiempo real
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  // Función para desloguearse y limpiar sesión
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

  // Función interactiva del botón central (+) para simular reservas o pedidos en tiempo real
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
                total: 25000 + Math.floor(Math.random() * 10000),
                tarifa_servicio: 3000,
                subtotal: 22000,
                cantidad_productos: 2,
                items: [],
              };

              await AsyncStorage.setItem('orders', JSON.stringify([simulatedOrder, ...currentOrders]));
              loadDashboardData();
              Alert.alert('Simulación exitosa', `Se añadió el pedido #${nextId.toString().padStart(3, '0')} a la base de datos.`);
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
                cantidad: 4 + Math.floor(Math.random() * 4),
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
              loadDashboardData();
              Alert.alert('Simulación exitosa', `Se añadió la reserva a nombre de "${simulatedReserva.cliente}" para hoy.`);
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

      {/* --- HEADER ORANGE --- */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Parri-Ya!</Text>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.grillLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* --- DASHBOARD SECTIONS --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* --- ULTIMOS PEDIDOS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ultimos Pedidos</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/pedidos')}
            >
              <Text style={styles.linkText}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Cabecera de Tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, styles.orderColNro]}>Nro</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColNombre]}>Nombre/cliente</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColEstado]}>Estado</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColPrecio]}>Precio</Text>
            </View>

            {/* Filas de Tabla */}
            {orders.slice(0, 5).map((item, index) => {
              const isLast = index === Math.min(orders.length, 5) - 1;
              return (
                <View 
                  key={item.id + index} 
                  style={isLast ? styles.tableRowNoBorder : styles.tableRow}
                >
                  <Text style={[styles.orderNoText, styles.orderColNro]}>#{item.id}</Text>
                  <Text style={[styles.clientNameText, styles.orderColNombre]} numberOfLines={1}>{item.cliente}</Text>
                  <Text style={[styles.statusText, styles.orderColEstado]}>{item.estado}</Text>
                  <Text style={[styles.priceText, styles.orderColPrecio]}>
                    ${(item.precio).toLocaleString('es-AR')}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* --- RESERVAS DE HOY --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reservas de Hoy</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/reservas')}
            >
              <Text style={styles.linkText}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Cabecera de Tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, styles.reservaColHorario]}>Horario</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColNombre]}>Reserva a nombre de</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColCantidad]}>Cantidad</Text>
            </View>

            {/* Filas de Tabla */}
            {reservas.slice(0, 4).map((item, index) => {
              const isLast = index === Math.min(reservas.length, 4) - 1;
              return (
                <View 
                  key={item.id + index} 
                  style={isLast ? styles.tableRowNoBorder : styles.tableRow}
                >
                  <Text style={[styles.timeText, styles.reservaColHorario]}>{item.horario}</Text>
                  <Text style={[styles.clientNameText, styles.reservaColNombre]} numberOfLines={1}>{item.cliente}</Text>
                  <Text style={[styles.countText, styles.reservaColCantidad]}>{item.cantidad} pers.</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* --- FEEDBACK RECIENTE --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feedback Reciente</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/feedback')}
            >
              <Text style={styles.linkText}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {feedback.map((item, index) => {
              const isLast = index === feedback.length - 1;
              return (
                <View 
                  key={item.id} 
                  style={isLast ? styles.feedbackItemNoBorder : styles.feedbackItem}
                >
                  <View style={styles.feedbackHeader}>
                    <Text style={styles.feedbackClientName}>{item.cliente}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>{item.calificacion}</Text>
                      <Ionicons name="star" size={14} color={COLORS.primary} />
                    </View>
                  </View>
                  <Text style={styles.feedbackComment}>{item.comentario}</Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
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
