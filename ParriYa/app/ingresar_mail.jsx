import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/login.styles';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';
import api from '../services/api';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function IngresarMailScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      showAlert('Campo vacío', 'Por favor ingresá tu email.');
      return;
    }

    // Validación básica de formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      showAlert('Email inválido', 'El formato del email no es correcto.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/verificar-email', { email: emailTrimmed });
      // Si llega acá, el email existe (200 OK)
      router.push({ pathname: '/verificacion', params: { email: emailTrimmed } });
    } catch (error) {
      if (error.response?.status === 404) {
        showAlert('Email no encontrado', 'No existe una cuenta asociada a ese email.');
      } else {
        showAlert('Error', 'Ocurrió un problema. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? COLORS.backgroundDark : '#D1D1D1' }]}>
      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDarkMode ? colors.border : 'transparent',
          borderWidth: isDarkMode ? 1 : 0
        }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "#333333"} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={35} color="white" />
        </View>

        <Text style={styles.title}>Ingresa tu email</Text>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Introduce el email con el que te registraste para poder continuar con el restablecimiento de contraseña.
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel,
            {
              backgroundColor: colors.card,
              color: colors.textMuted
            }
          ]}>Email</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="usuario@mail.com"
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.mainButton, loading && { opacity: 0.7 }]}
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.mainButtonText}>Enviar</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}