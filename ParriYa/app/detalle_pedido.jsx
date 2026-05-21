import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Historial/detalle_pedido.styles';

const DETALLES_MOCK = [
  { id: 1, producto_nombre: 'Ribs de cerdo', cantidad: 1, precio_unitario: 20000, subtotal: 20000 },
  { id: 2, producto_nombre: 'Chorizo', cantidad: 1, precio_unitario: 5000, subtotal: 5000 },
  { id: 3, producto_nombre: 'Papas Fritas', cantidad: 1, precio_unitario: 7000, subtotal: 7000 },
];

export default function DetallePedidoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const pedido = {
    id: id || '6',
    fecha_pedido: '12/04/2026',
    estado: 'Finalizado',
    metodo_pago: 'Mercado Pago',
    total: 32000,
    cantidad_productos: 3
  };

  return (
    <View style={styles.container}>
      {/* Header Naranja */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle Pedido</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Resumen superior */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalle de Pedido #{pedido.id.toString().padStart(2, '0')}</Text>
          <Text style={styles.cardSubtitle}>Cantidad de productos ({pedido.cantidad_productos})</Text>
        </View>

        {/* Lista de productos (detalle_pedido) */}
        <View style={styles.card}>
          {DETALLES_MOCK.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.producto_nombre}</Text>
              <View style={styles.itemPriceContainer}>
                <Text style={styles.itemQty}>x{item.cantidad}</Text>
                <Text style={styles.itemPrice}>${item.subtotal.toLocaleString('es-AR')}</Text>
              </View>
            </View>
          ))}

          {/* Línea separadora */}
          <View style={styles.dividerContainer}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>

          {/* Fila Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${pedido.total.toLocaleString('es-AR')}</Text>
          </View>
        </View>

        {/* Información General del Pedido */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° de pedido</Text>
            <Text style={styles.infoValue}>#{pedido.id.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha del pedido</Text>
            <Text style={styles.infoValue}>{pedido.fecha_pedido}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado del pedido</Text>
            <Text style={styles.infoValue}>{pedido.estado}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total</Text>
            <Text style={styles.infoValue}>${pedido.total.toLocaleString('es-AR')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Metodo de pago</Text>
            <Text style={styles.infoValue}>{pedido.metodo_pago}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}