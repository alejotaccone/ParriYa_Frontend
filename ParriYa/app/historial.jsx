import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Historial/historial.styles';

// Mock de datos usando los nombres de tu entidad 'pedido'
const PEDIDOS_MOCK = [
  { id: 6, fecha_pedido: '16/04/2026', total: 32000, cantidad_productos: 2 },
  { id: 5, fecha_pedido: '12/04/2026', total: 32000, cantidad_productos: 3 },
  { id: 4, fecha_pedido: '07/03/2026', total: 41000, cantidad_productos: 3 },
  { id: 3, fecha_pedido: '29/02/2026', total: 21000, cantidad_productos: 1 },
  { id: 2, fecha_pedido: '27/01/2026', total: 58000, cantidad_productos: 4 },
  { id: 1, fecha_pedido: '08/01/2026', total: 17000, cantidad_productos: 1 },
];

export default function HistorialScreen() {
  const router = useRouter();

  const renderPedido = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={0.8}
      // Acá le pasamos el ID del pedido a la nueva pantalla
      onPress={() => router.push({ pathname: '/detalle_pedido', params: { id: item.id } })}
    >
      {/* Fila superior: Fecha y etiqueta Monto */}
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{item.fecha_pedido}</Text>
        <Text style={styles.montoLabel}>Monto</Text>
      </View>

      {/* Tarjeta gris del pedido */}
      <View style={styles.pedidoCard}>
        <View style={styles.pedidoInfo}>
          <Text style={styles.pedidoTitle}>
            Pedido #{item.id.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.productosText}>
            Cantidad de productos ({item.cantidad_productos})
          </Text>
        </View>
        <Text style={styles.totalText}>
          ${item.total.toLocaleString('es-AR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Naranja */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de compras</Text>
      </View>

      {/* Píldora de Recientes */}
      <View style={styles.recientesPill}>
        <Text style={styles.recientesText}>
          <Text style={styles.recientesBold}>Recientes </Text>
          (Ultimos 90 dias)
        </Text>
      </View>

      {/* Lista de Pedidos */}
      <FlatList
        data={PEDIDOS_MOCK}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPedido}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}