import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Historial/detalle_pedido.styles';

const PEDIDOS_MOCK = [
  {
    id: 6,
    fecha_pedido: '16/04/2026',
    estado: 'Finalizado',
    metodo_pago: 'Mercado Pago',
    total: 32000,
    cantidad_productos: 2,
    usuario: 'usuario.123',
  },
  {
    id: 5,
    fecha_pedido: '12/04/2026',
    estado: 'Finalizado',
    metodo_pago: 'Mercado Pago',
    total: 32000,
    cantidad_productos: 3,
    usuario: 'usuario.123',
  },
  {
    id: 4,
    fecha_pedido: '07/03/2026',
    estado: 'Cancelado',
    metodo_pago: 'Tarjeta',
    total: 41000,
    cantidad_productos: 3,
    usuario: 'otro.usuario',
  },
];

const DETALLES_MOCK = {
  6: {
    pedido: {
      id: 6,
      fecha_pedido: '16/04/2026',
      estado: 'Finalizado',
      metodo_pago: 'Mercado Pago',
      total: 32000,
      cantidad_productos: 2,
    },
    items: [
      { id: 1, producto_nombre: 'Ribs de cerdo', cantidad: 1, subtotal: 20000 },
      { id: 2, producto_nombre: 'Papas Fritas', cantidad: 1, subtotal: 12000 },
    ],
  },
  5: {
    pedido: {
      id: 5,
      fecha_pedido: '12/04/2026',
      estado: 'Finalizado',
      metodo_pago: 'Mercado Pago',
      total: 32000,
      cantidad_productos: 3,
    },
    items: [
      { id: 1, producto_nombre: 'Ribs de cerdo', cantidad: 1, subtotal: 20000 },
      { id: 2, producto_nombre: 'Chorizo', cantidad: 1, subtotal: 5000 },
      { id: 3, producto_nombre: 'Papas Fritas', cantidad: 1, subtotal: 7000 },
    ],
  },
  4: {
    pedido: {
      id: 4,
      fecha_pedido: '07/03/2026',
      estado: 'Cancelado',
      metodo_pago: 'Tarjeta',
      total: 41000,
      cantidad_productos: 3,
    },
    items: [
      { id: 1, producto_nombre: 'Vacío', cantidad: 1, subtotal: 24000 },
      { id: 2, producto_nombre: 'Ensalada', cantidad: 1, subtotal: 7000 },
      { id: 3, producto_nombre: 'Bebida', cantidad: 1, subtotal: 10000 },
    ],
  },
};

export default function DetallePedidoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState(null);
  const [detalleItems, setDetalleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetallePedido() {
      try {
        const storedUser = await AsyncStorage.getItem('activeUser');
        if (!storedUser) {
          router.replace('/login');
          return;
        }

        const pedidoId = Number(id);
        const storedOrdersJson = await AsyncStorage.getItem('orders');
        const storedOrders = storedOrdersJson ? JSON.parse(storedOrdersJson) : [];
        const storedOrder = storedOrders.find((order) => order.id === pedidoId);

        if (storedOrder) {
          setPedido(storedOrder);
          setDetalleItems(storedOrder.items || []);
        } else {
          const orderData = DETALLES_MOCK[pedidoId];
          if (orderData) {
            setPedido(orderData.pedido);
            setDetalleItems(orderData.items);
          } else {
            const fallbackPedido = PEDIDOS_MOCK.find((p) => p.id === pedidoId);
            setPedido(
              fallbackPedido || {
                id: pedidoId,
                fecha_pedido: '',
                estado: 'Desconocido',
                metodo_pago: 'Desconocido',
                total: 0,
                cantidad_productos: 0,
              }
            );
            setDetalleItems([]);
          }
        }
      } catch (error) {
        console.error('Error cargando detalle de pedido:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDetallePedido();
  }, [id, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E76F41" style={styles.loadingIndicator} />
      </View>
    );
  }

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
          {detalleItems.length > 0 ? (
            detalleItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.producto_nombre}</Text>
                <View style={styles.itemPriceContainer}>
                  <Text style={styles.itemQty}>x{item.cantidad}</Text>
                  <Text style={styles.itemPrice}>${item.subtotal.toLocaleString('es-AR')}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyOrderContainer}>
              <Text style={styles.emptyOrderText}>No hay detalles disponibles para este pedido.</Text>
            </View>
          )}

          <View style={styles.dividerContainer}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>

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