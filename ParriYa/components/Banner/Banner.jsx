import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Banner.styles';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../../constants/colors';

const OFERTAS = [
  {
    id: 1,
    titulo: 'Ofertas del día',
    texto: 'Hasta 20% OFF en Bebidas',
    descuento: '20%',
    categoria: 'Bebidas',
    imagen: require('../../assets/images/PromoGuarnicion.png'),
  },
  {
    id: 2,
    titulo: 'Promoción especial',
    texto: 'Hasta 15% OFF en Carnes Premium',
    descuento: '15%',
    categoria: 'Carnes',
    imagen: require('../../assets/images/PromoGuarnicion.png'),
  },
  {
    id: 3,
    titulo: 'Happy Hour',
    texto: 'Hasta 10% OFF en Sandwiches',
    descuento: '10%',
    categoria: 'Sandwiches',
    imagen: require('../../assets/images/PromoGuarnicion.png'),
  },
];

const Banner = () => {
  const [ofertaActual, setOfertaActual] = useState(0);
  const oferta = OFERTAS[ofertaActual];
  const { colors, isDarkMode } = useTheme();

  const handleAnterior = () => {
    setOfertaActual((prev) => (prev === 0 ? OFERTAS.length - 1 : prev - 1));
  };

  const handleSiguiente = () => {
    setOfertaActual((prev) => (prev === OFERTAS.length - 1 ? 0 : prev + 1));
  };

  return (
    <View style={styles.container}>
      {/* Etiqueta pequeña superior */}
      <Text style={styles.titleSection}>{oferta.titulo}</Text>

      {/* Fila principal con texto e imagen */}
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.promoText}>
            Hasta <Text style={styles.highlightText}>{oferta.descuento} OFF</Text> en{' '}
            {oferta.categoria}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={oferta.imagen}
            style={styles.foodImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Flechas de navegación del carrusel */}
      <TouchableOpacity
        style={[
          styles.arrowLeft,
          {
            backgroundColor: colors.card,
            borderColor: isDarkMode ? colors.border : 'transparent',
            borderWidth: isDarkMode ? 1 : 0,
          },
        ]}
        onPress={handleAnterior}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={isDarkMode ? COLORS.primary : '#C84B22'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.arrowRight,
          {
            backgroundColor: colors.card,
            borderColor: isDarkMode ? colors.border : 'transparent',
            borderWidth: isDarkMode ? 1 : 0,
          },
        ]}
        onPress={handleSiguiente}
      >
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDarkMode ? COLORS.primary : '#C84B22'}
        />
      </TouchableOpacity>

      {/* Puntitos de paginación inferiores dinámicos */}
      <View style={styles.dotsContainer}>
        {OFERTAS.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setOfertaActual(index)}
            style={[
              styles.dot,
              index === ofertaActual && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Banner;