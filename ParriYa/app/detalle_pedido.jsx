import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Historial/detalle_pedido.styles';
import api from '../services/api';

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

        const response = await api.get(`/pedidos/${id}`);
        if (response.data) {
          const p = response.data;
          setPedido({
            id: p.id,
            fecha_pedido: p.fechaPedido ? new Date(p.fechaPedido).toLocaleDateString('es-AR') : 'Reciente',
            estado: p.estado || 'Recibido',
            metodo_pago: (p.pagos && p.pagos.length > 0) ? p.pagos[0].metodo : 'Efectivo',
            total: p.total,
            cantidad_productos: (p.detalles || []).reduce((sum, det) => sum + det.cantidad, 0),
          });
          setDetalleItems((p.detalles || []).map(det => ({
            id: det.id,
            producto_nombre: det.nombreProducto || 'Producto',
            cantidad: det.cantidad || 1,
            subtotal: det.subtotal || 0,
          })));
        } else {
          setPedido({
            id: Number(id),
            fecha_pedido: '',
            estado: 'Desconocido',
            metodo_pago: 'Desconocido',
            total: 0,
            cantidad_productos: 0,
          });
          setDetalleItems([]);
        }
      } catch (error) {
        console.error('Error cargando detalle de pedido del backend:', error.message);
        setPedido({
          id: Number(id),
          fecha_pedido: '',
          estado: 'Error al cargar',
          metodo_pago: 'Desconocido',
          total: 0,
          cantidad_productos: 0,
        });
        setDetalleItems([]);
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