import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Banner.styles";
import { useTheme } from "../ThemeContext";
import { COLORS } from "../../constants/colors";

const AVISOS = [
  {
    id: 1,
    titulo: "Horarios",
    texto: "De lunes a domingo de 12:00pm a 12:00am",
    imagen: require("../../assets/images/Logo.png"),
  },
  {
    id: 2,
    titulo: "Realiza tu pedido con nosotros",
    texto: "Recorda que solo contamos con servicio de retiro en local",
    imagen: require("../../assets/images/Logo.png"),
  },
];

const Banner = () => {
  const [avisoActual, setAvisoActual] = useState(0);
  const aviso = AVISOS[avisoActual];
  const { colors, isDarkMode } = useTheme();

  const handleAnterior = () => {
    setAvisoActual((prev) => (prev === 0 ? AVISOS.length - 1 : prev - 1));
  };

  const handleSiguiente = () => {
    setAvisoActual((prev) => (prev === AVISOS.length - 1 ? 0 : prev + 1));
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDarkMode ? colors.card : COLORS.primaryDark,
        borderColor: isDarkMode ? colors.border : "transparent",
        borderWidth: isDarkMode ? 1 : 0,
      }
    ]}>
      {/* Etiqueta pequeña superior */}
      <Text style={[styles.titleSection, { color: isDarkMode ? colors.text : COLORS.backgroundLight }]}>
        {aviso.titulo}
      </Text>

      {/* Fila principal con texto e imagen */}
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={[styles.promoText, { color: isDarkMode ? colors.textMuted : COLORS.primaryLight }]}>
            {aviso.texto}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={aviso.imagen}
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
            borderColor: isDarkMode ? colors.border : "transparent",
            borderWidth: isDarkMode ? 1 : 0,
          },
        ]}
        onPress={handleAnterior}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={isDarkMode ? COLORS.primary : "#C84B22"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.arrowRight,
          {
            backgroundColor: colors.card,
            borderColor: isDarkMode ? colors.border : "transparent",
            borderWidth: isDarkMode ? 1 : 0,
          },
        ]}
        onPress={handleSiguiente}
      >
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDarkMode ? COLORS.primary : "#C84B22"}
        />
      </TouchableOpacity>

      {/* Puntitos de paginación inferiores dinámicos */}
      <View style={styles.dotsContainer}>
        {AVISOS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setAvisoActual(index)}
            style={[
              styles.dot,
              index === avisoActual 
                ? { backgroundColor: isDarkMode ? COLORS.primary : COLORS.highlight } 
                : { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)' }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Banner;
