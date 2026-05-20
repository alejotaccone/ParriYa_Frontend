import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Banner.styles';

const Banner = () => {
  return (
    <View style={styles.container}>
      {/* Etiqueta pequeña superior */}
      <Text style={styles.titleSection}>Ofertas del día</Text>

      {/* Fila principal con texto e imagen */}
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.promoText}>
            Hasta <Text style={styles.highlightText}>20% OFF</Text> en Guarniciones
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            // Asegúrate de tener una imagen descriptiva o temporal para las papas/ensalada
            source={require('../../assets/images/PromoGuarnicion.png')} 
            style={styles.foodImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Flechas de navegación del carrusel */}
      <TouchableOpacity style={styles.arrowLeft}>
        <Ionicons name="chevron-back" size={18} color="#C84B22" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.arrowRight}>
        <Ionicons name="chevron-forward" size={18} color="#C84B22" />
      </TouchableOpacity>

      {/* Puntitos de paginación inferiores */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

export default Banner;