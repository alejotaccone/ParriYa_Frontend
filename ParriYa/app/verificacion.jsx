import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

export default function VerificacionScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const inputRefs = useRef([]);
  const { colors, isDarkMode } = useTheme();

  const handleTextChange = (text, index) => {
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={[styles.verificationContainer, { backgroundColor: isDarkMode ? COLORS.backgroundDark : '#D1D1D1' }]}>
      <View style={[
        styles.modalCard, 
        { 
          backgroundColor: colors.card, 
          borderColor: isDarkMode ? colors.border : 'transparent', 
          borderWidth: isDarkMode ? 1 : 0 
        }
      ]}>
        <TouchableOpacity style={styles.backButtonModal} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "#333333"} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={40} color="white" />
        </View>

        <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : COLORS.primary }]}>Codigo enviado!</Text>
        <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
          Revisa tu casilla de mail (<Text style={[styles.boldEmail, { color: colors.text }]}>{email}</Text>) e ingresa el codigo de verificación:
        </Text>

        <View style={styles.codeRow}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={[
                styles.codeBox, 
                { 
                  backgroundColor: isDarkMode ? colors.box : '#FEF4F1', 
                  color: isDarkMode ? '#ffffff' : COLORS.primary, 
                  borderColor: isDarkMode ? colors.border : COLORS.primary 
                }
              ]}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleTextChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => router.push({ pathname: '/nueva_contrasena', params: { email } })}
        >
          <Text style={styles.verifyButtonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}