import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api from '../../services/api';

export default function BackofficeFeedback() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);

  // Carga feedbacks desde el backend
  const loadFeedbacks = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

      const response = await api.get('/feedback');
      if (response.data && response.data.length > 0) {
        const mapped = response.data.map((f) => ({
          id: String(f.id),
          cliente: f.nombreCliente || 'Cliente',
          fecha: f.fecha ? new Date(f.fecha).toLocaleDateString('es-AR') : 'Reciente',
          pedido_id: f.pedidoId ? String(f.pedidoId).padStart(3, '0') : 'N/A',
          comentario: f.comentario || '',
          calificacion: f.calificacion || 5,
        }));
        setFeedbacks(mapped);
      } else {
        setFeedbacks([]);
      }
    } catch (e) {
      console.warn('Error cargando feedbacks de backend:', e.message);
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Función para renderizar estrellas de manera dinámica y premium usando Ionicons
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= roundedRating;
      stars.push(
        <Ionicons
          key={i}
          name={isFilled ? "star" : "star-outline"}
          size={16}
          color={COLORS.primary}
          style={styles.feedbackStarIcon}
        />
      );
    }
    return <View style={styles.feedbackStarsRow}>{stars}</View>;
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
            await AsyncStorage.removeItem('authToken');
            router.replace('/login');
          },
        },
      ]
    );
  };

  // Botón central de simulación rápida
  const handleQuickAction = () => {
    Alert.alert(
      'Acciones del Administrador',
      'Simula operaciones para poblar la base de datos:',
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
                usuario: 'María Belén',
                fecha_pedido: '02/06/2026',
                estado: 'Listo',
                metodo_pago: 'Mercado Pago',
                total: 18000,
                tarifa_servicio: 3000,
                subtotal: 15000,
                cantidad_productos: 1,
                items: [{ producto_nombre: 'Vacío', cantidad: 1, subtotal: 15000 }],
              };
              await AsyncStorage.setItem('orders', JSON.stringify([simulatedOrder, ...currentOrders]));
              Alert.alert('Simulación exitosa', 'Pedido simulado guardado.');
            } catch (e) {
              console.error(e);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
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
          <Text style={styles.backHeaderTitle}>Feedback</Text>
        </View>
      </View>

      {/* --- RECIENTES BANNER --- */}
      <View style={[styles.recientesBanner, { backgroundColor: isDarkMode ? colors.card : COLORS.borderMedium }]}>
        <Text style={[styles.recientesText, { color: colors.text }]}>Recientes</Text>
        <Text style={[styles.ultimos7DiasText, { color: colors.textMuted }]}>(Ultimos 90 dias)</Text>
      </View>

      {/* --- LISTADO DE DETALLE DE FEEDBACK --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {feedbacks.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.feedbackDetailCard,
              {
                backgroundColor: colors.card,
                borderColor: isDarkMode ? colors.border : 'transparent',
                borderWidth: isDarkMode ? 1 : 0,
              }
            ]}
          >
            {/* Header: Cliente y Estrellas */}
            <View style={styles.feedbackHeaderRow}>
              <Text style={[styles.feedbackClientNameText, { color: colors.text }]}>{item.cliente}</Text>
              {renderStars(item.calificacion)}
            </View>

            {/* Metadatos: Fecha y Nro de Pedido */}
            <View style={styles.feedbackMetaRow}>
              <Text style={[styles.feedbackDateText, { color: colors.textMuted }]}>{item.fecha}</Text>
              <Text style={[styles.feedbackOrderText, { color: colors.textMuted }]}>Pedido #{item.pedido_id}</Text>
            </View>

            {/* Comentario descriptivo */}
            <Text style={[styles.feedbackCommentText, { color: colors.text }]}>
              {item.comentario}
            </Text>

          </View>
        ))}
      </ScrollView>

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
