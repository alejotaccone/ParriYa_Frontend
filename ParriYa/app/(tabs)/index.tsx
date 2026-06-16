import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner'; 
import EstadoPedido from '../../components/EstadoPedido/EstadoPedido';
import Categorias from '../../components/CategoriasInicio/Categorias';
import MasVendidos from '../../components/MasVendidos/MasVendidos'; 
import { styles } from './index.styles';
import { useTheme } from '../../components/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();

  const handleWhatsAppRedirect = async () => {
    const phoneNumber = '5491123273588';
    const message = '¡Hola Parrilla Los Pibes! Me gustaría realizar una reserva para las XX:XXhs.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp no disponible',
          'No pudimos abrir la aplicación de WhatsApp. Asegúrate de tenerla instalada.'
        );
      }
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
      Alert.alert(
        'Error',
        'Ocurrió un problema al intentar abrir WhatsApp.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* El Header queda afuera del ScrollView para que quede fijo arriba siempre */}
      <Header />      
      
      {/* Envolvemos el resto para que el usuario pueda deslizar hacia abajo */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Banner />
        <EstadoPedido />
        <Categorias />
        <MasVendidos />
      </ScrollView>

      {/* Botón flotante de WhatsApp posicionado absolutamente */}
      <TouchableOpacity 
        style={styles.whatsappButton} 
        activeOpacity={0.8}
        onPress={handleWhatsAppRedirect}
      >
        <Image 
          source={require('../../assets/images/Whatsapp.png')} 
          style={styles.whatsappIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
