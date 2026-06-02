import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';

// --- MOCK DETAILS FROM THE IMAGE FOR PERSISTENT SEEDING ---
const FEEDBACK_DETALLE_MOCK = [
  {
    id: '1',
    cliente: 'Enzo Mussi',
    fecha: 'Hoy, 14:32',
    pedido_id: '023',
    comentario: 'El lomo a la parrilla estaba en su punto exacto, muy tierno y jugoso. Las papas fritas crocantes como siempre. Definitivamente vuelvo.',
    calificacion: 4,
  },
  {
    id: '2',
    cliente: 'Lucía Torres',
    fecha: 'Ayer, 15:32',
    pedido_id: '020',
    comentario: 'Muy rico todo, el chorizo estaba perfecto. La entrega tardó un poco más de lo esperado pero el sabor lo vale.',
    calificacion: 4,
  },
  {
    id: '3',
    cliente: 'Marcos Olise',
    fecha: 'Hoy, 16:32',
    pedido_id: '017',
    comentario: 'Las papas fritas son un must, siempre crocantes y en el punto. El lomo también impecable. El mejor asado a domicilio de la zona.',
    calificacion: 4,
  },
  {
    id: '4',
    cliente: 'Ana Paredes',
    fecha: 'Hoy, 11:21',
    pedido_id: '010',
    comentario: 'El pollo estaba rico pero llegó un poco frío. Esperaba más jugosidad. La atención por WhatsApp fue buena.',
    calificacion: 4,
  },
];

export default function BackofficeFeedback() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);

  // Carga y combina feedbacks de AsyncStorage
  const loadFeedbacks = async () => {
    try {
      const storedJson = await AsyncStorage.getItem('feedbacks');
      if (storedJson) {
        setFeedbacks(JSON.parse(storedJson));
      } else {
        await AsyncStorage.setItem('feedbacks', JSON.stringify(FEEDBACK_DETALLE_MOCK));
        setFeedbacks(FEEDBACK_DETALLE_MOCK);
      }
    } catch (e) {
      console.error('Error cargando feedbacks:', e);
      setFeedbacks(FEEDBACK_DETALLE_MOCK);
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
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  // Función para gestionar y borrar feedbacks al tocarlos (Acción del admin)
  const handleManageFeedback = (feedbackId, cliente) => {
    Alert.alert(
      'Gestionar Reseña',
      `Elige una acción para el feedback de "${cliente}":`,
      [
        {
          text: 'Eliminar de la vista',
          style: 'destructive',
          onPress: async () => {
            const updated = feedbacks.filter((f) => f.id !== feedbackId);
            await AsyncStorage.setItem('feedbacks', JSON.stringify(updated));
            setFeedbacks(updated);
            Alert.alert('Eliminado', 'Se ha removido el feedback.');
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
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

  // Botón central de simulación rápida
  const handleQuickAction = () => {
    Alert.alert(
      'Acciones del Administrador',
      'Simula operaciones para poblar la base de datos local:',
      [
        {
          text: 'Simular nuevo Feedback',
          onPress: async () => {
            try {
              const currentJson = await AsyncStorage.getItem('feedbacks');
              const current = currentJson ? JSON.parse(currentJson) : [];
              
              const newFeed = {
                id: Date.now().toString(),
                cliente: 'María Belén',
                fecha: 'Hoy, 10:15',
                pedido_id: '025',
                comentario: 'El vacío al plato estaba increíble, cocido a la perfección. La entrega súper rápida y las porciones abundantes.',
                calificacion: 5,
              };

              const updated = [newFeed, ...current];
              await AsyncStorage.setItem('feedbacks', JSON.stringify(updated));
              setFeedbacks(updated);
              Alert.alert('Simulación exitosa', 'Se añadió una nueva reseña de 5 estrellas.');
            } catch (e) {
              console.error(e);
            }
          },
        },
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
          <Text style={styles.backHeaderTitle}>Feedback</Text>
        </View>
      </View>

      {/* --- RECIENTES BANNER --- */}
      <View style={styles.recientesBanner}>
        <Text style={styles.recientesText}>Recientes</Text>
        <Text style={styles.ultimos7DiasText}>(Ultimos 90 dias)</Text>
      </View>

      {/* --- LISTADO DE DETALLE DE FEEDBACK --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {feedbacks.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.feedbackDetailCard}
            activeOpacity={0.8}
            onPress={() => handleManageFeedback(item.id, item.cliente)}
          >
            {/* Header: Cliente y Estrellas */}
            <View style={styles.feedbackHeaderRow}>
              <Text style={styles.feedbackClientNameText}>{item.cliente}</Text>
              {renderStars(item.calificacion)}
            </View>

            {/* Metadatos: Fecha y Nro de Pedido */}
            <View style={styles.feedbackMetaRow}>
              <Text style={styles.feedbackDateText}>{item.fecha}</Text>
              <Text style={styles.feedbackOrderText}>Pedido #{item.pedido_id}</Text>
            </View>

            {/* Comentario descriptivo */}
            <Text style={styles.feedbackCommentText}>
              {item.comentario}
            </Text>

          </TouchableOpacity>
        ))}
      </ScrollView>

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
