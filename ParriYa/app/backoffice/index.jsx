import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api from '../../services/api';

export default function BackofficeDashboard() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
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
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

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
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Ultimos Pedidos</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/pedidos')}
            >
              <Text style={[styles.linkText, { color: colors.textMuted }]}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={isDarkMode ? colors.textMuted : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            }
          ]}>
            {/* Cabecera de Tabla */}
            <View style={[styles.tableHeader, { borderBottomColor: isDarkMode ? colors.border : '#F0F0F0' }]}>
              <Text style={[styles.tableHeaderCol, styles.orderColNro, { color: colors.textMuted }]}>Nro</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColNombre, { color: colors.textMuted }]}>Nombre/cliente</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColEstado, { color: colors.textMuted }]}>Estado</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColPrecio, { color: colors.textMuted }]}>Precio</Text>
            </View>

            {/* Filas de Tabla */}
            {orders.slice(0, 5).map((item, index) => {
              const isLast = index === Math.min(orders.length, 5) - 1;
              const rowBorderColor = isDarkMode ? colors.border : '#F2F2F2';
              return (
                <View 
                  key={item.id + index} 
                  style={[
                    isLast ? styles.tableRowNoBorder : styles.tableRow,
                    !isLast && { borderBottomColor: rowBorderColor }
                  ]}
                >
                  <Text style={[styles.orderNoText, styles.orderColNro, { color: colors.text }]}>#{item.id}</Text>
                  <Text style={[styles.clientNameText, styles.orderColNombre, { color: colors.text }]} numberOfLines={1}>{item.cliente}</Text>
                  <Text style={[styles.statusText, styles.orderColEstado]}>{item.estado}</Text>
                  <Text style={[styles.priceText, styles.orderColPrecio, { color: colors.text }]}>
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
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Reservas de Hoy</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/reservas')}
            >
              <Text style={[styles.linkText, { color: colors.textMuted }]}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={isDarkMode ? colors.textMuted : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            }
          ]}>
            {/* Cabecera de Tabla */}
            <View style={[styles.tableHeader, { borderBottomColor: isDarkMode ? colors.border : '#F0F0F0' }]}>
              <Text style={[styles.tableHeaderCol, styles.reservaColHorario, { color: colors.textMuted }]}>Horario</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColNombre, { color: colors.textMuted }]}>Reserva a nombre de</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColCantidad, { color: colors.textMuted }]}>Cantidad</Text>
            </View>

            {/* Filas de Tabla */}
            {reservas.slice(0, 4).map((item, index) => {
              const isLast = index === Math.min(reservas.length, 4) - 1;
              const rowBorderColor = isDarkMode ? colors.border : '#F2F2F2';
              return (
                <View 
                  key={item.id + index} 
                  style={[
                    isLast ? styles.tableRowNoBorder : styles.tableRow,
                    !isLast && { borderBottomColor: rowBorderColor }
                  ]}
                >
                  <Text style={[styles.timeText, styles.reservaColHorario, { color: colors.text }]}>{item.horario}</Text>
                  <Text style={[styles.clientNameText, styles.reservaColNombre, { color: colors.text }]} numberOfLines={1}>{item.cliente}</Text>
                  <Text style={[styles.countText, styles.reservaColCantidad]}>{item.cantidad} pers.</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* --- FEEDBACK RECIENTE --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Feedback Reciente</Text>
            <TouchableOpacity 
              style={styles.linkTextContainer}
              onPress={() => router.push('/backoffice/feedback')}
            >
              <Text style={[styles.linkText, { color: colors.textMuted }]}>Ver todos</Text>
              <Ionicons name="arrow-forward" size={14} color={isDarkMode ? colors.textMuted : COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            }
          ]}>
            {feedback.map((item, index) => {
              const isLast = index === feedback.length - 1;
              const itemBorderColor = isDarkMode ? colors.border : '#F2F2F2';
              return (
                <View 
                  key={item.id} 
                  style={[
                    isLast ? styles.feedbackItemNoBorder : styles.feedbackItem,
                    !isLast && { borderBottomColor: itemBorderColor }
                  ]}
                >
                  <View style={styles.feedbackHeader}>
                    <Text style={[styles.feedbackClientName, { color: colors.text }]}>{item.cliente}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={[styles.ratingText, { color: colors.textMuted }]}>{item.calificacion}</Text>
                      <Ionicons name="star" size={14} color={COLORS.primary} />
                    </View>
                  </View>
                  <Text style={[styles.feedbackComment, { color: isDarkMode ? colors.textMuted : COLORS.textSecondary }]}>{item.comentario}</Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
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
