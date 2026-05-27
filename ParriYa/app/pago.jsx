import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Pago/pago.styles';

const SUGERENCIAS_MOCK = [
  { id: '1', nombre: 'Lomo a la parrilla', image: require('../assets/images/prod_lomo.png') },
  { id: '2', nombre: 'Tira de asado', image: require('../assets/images/prod_lomo.png') }, 
  { id: '3', nombre: 'Papas fritas', image: require('../assets/images/prod_papasfritas.png') },
];

export default function PagoScreen() {
  const router = useRouter();
  
  const [metodoPago, setMetodoPago] = useState('mercado_pago'); 
  const [guardarDatos, setGuardarDatos] = useState(true);

  return (
    <View style={styles.container}>
      
      {/* El ScrollView ahora es el contenedor principal blanco */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Botón Volver arriba de todo */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#4B2610" />
        </TouchableOpacity>

        {/* Sección Resumen */}
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenText}>Lomo vacuno</Text>
          <View style={styles.resumenRight}>
            <Text style={styles.resumenQty}>x1</Text>
            <Text style={styles.resumenPrice}>$20000</Text>
          </View>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenText}>Chorizo</Text>
          <View style={styles.resumenRight}>
            <Text style={styles.resumenQty}>x1</Text>
            <Text style={styles.resumenPrice}>$5000</Text>
          </View>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenText}>Tarifa de servicio</Text>
          <View style={styles.resumenRight}>
            <Text style={styles.resumenPrice}>$3000</Text>
          </View>
        </View>

        {/* Sección Métodos de Pago */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Metodos de pago</Text>
        
        {/* Opción Efectivo */}
        <TouchableOpacity 
          style={styles.paymentMethodEfectivo} 
          activeOpacity={0.8}
          onPress={() => setMetodoPago('efectivo')}
        >
          <View style={styles.paymentLeft}>
            <Ionicons name="cash-outline" size={28} color="white" />
            <Text style={styles.paymentText}>Efectivo</Text>
          </View>
          <Ionicons 
            name={metodoPago === 'efectivo' ? "radio-button-on" : "radio-button-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Opción Tarjeta Mercado Pago */}
        <TouchableOpacity 
          style={styles.paymentMethodTarjeta} 
          activeOpacity={0.8}
          onPress={() => setMetodoPago('mercado_pago')}
        >
          <View style={styles.paymentLeft}>
            <View style={styles.cardIconWrapper}>
               <Ionicons name="card" size={24} color="#FF5A2D" /> 
            </View>
            <View>
              <Text style={styles.paymentTextBold}>Tarjeta Mercado Pago</Text>
              <Text style={styles.paymentSubtext}>**** 0505</Text>
            </View>
          </View>
          <Ionicons 
            name={metodoPago === 'mercado_pago' ? "radio-button-on" : "radio-button-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Checkbox Guardar Datos */}
        <TouchableOpacity 
          style={styles.checkboxRow} 
          activeOpacity={0.7}
          onPress={() => setGuardarDatos(!guardarDatos)}
        >
          <Ionicons 
            name={guardarDatos ? "checkbox" : "square-outline"} 
            size={22} 
            color={guardarDatos ? "#E76F41" : "#8E8E93"} 
          />
          <Text style={styles.checkboxText}>Guardar datos para futuras compras</Text>
        </TouchableOpacity>

        {/* Sección ¿Te olvidaste algo? */}
        <Text style={styles.sectionTitle}>¿Te olvidaste algo?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {SUGERENCIAS_MOCK.map((item) => (
            <View key={item.id} style={styles.suggestionCard}>
              <Image source={item.image} style={styles.suggestionImage} resizeMode="contain" />
              <Text style={styles.suggestionName} numberOfLines={1}>{item.nombre}</Text>
            </View>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Footer de Pago Fijo Abajo */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>
            <Text style={styles.currencySymbol}>$ </Text>28.000
          </Text>
        </View>
        <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}