import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Historial/historial.styles';
import api from '../services/api';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

export default function HistorialScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    async function loadHistorial() {
      try {
        const storedUser = await AsyncStorage.getItem('activeUser');
        if (!storedUser) {
          router.replace('/login');
          return;
        }

        const response = await api.get('/pedidos/mis-pedidos');
        if (response.data && response.data.length > 0) {
          const formatted = response.data.map(p => ({
            id: p.id,
            fecha_pedido: p.fechaPedido ? new Date(p.fechaPedido).toLocaleDateString('es-AR') : 'Reciente',
            total: p.total,
            cantidad_productos: (p.detalles || []).reduce((sum, det) => sum + det.cantidad, 0),
          }));
          setPedidos(formatted);
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error('Error cargando historial de pedidos del backend:', error.message);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistorial();
  }, [router]);

  const renderPedido = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/detalle_pedido', params: { id: item.id } })}
    >
      {/* Fila superior: Fecha y etiqueta Monto */}
      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.fecha_pedido}</Text>
        <Text style={[styles.montoLabel, { color: colors.textMuted }]}>Monto</Text>
      </View>

      {/* Tarjeta gris del pedido */}
      <View style={[
        styles.pedidoCard, 
        { 
          backgroundColor: colors.card,
          borderColor: isDarkMode ? colors.border : "transparent",
          borderWidth: isDarkMode ? 1 : 0
        }
      ]}>
        <View style={styles.pedidoInfo}>
          <Text style={[styles.pedidoTitle, { color: colors.text }]}>
            Pedido #{item.id.toString().padStart(2, '0')}
          </Text>
          <Text style={[styles.productosText, { color: colors.textMuted }]}>
            Cantidad de productos ({item.cantidad_productos})
          </Text>
        </View>
        <Text style={[styles.totalText, { color: colors.text }]}>
          ${item.total.toLocaleString('es-AR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Naranja */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de compras</Text>
      </View>

      {/* Píldora de Recientes */}
      <View style={[
        styles.recientesPill, 
        { 
          backgroundColor: colors.box,
          borderColor: isDarkMode ? colors.border : "transparent",
          borderWidth: isDarkMode ? 1 : 0
        }
      ]}>
        <Text style={[styles.recientesText, { color: colors.textMuted }]}>
          <Text style={[styles.recientesBold, { color: colors.text }]}>Recientes </Text>
          (Ultimos 90 dias)
        </Text>
      </View>

      {/* Lista de Pedidos */}
      <FlatList
        data={loading ? [] : pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPedido}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E76F41" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>No se encontraron pedidos para este usuario.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}