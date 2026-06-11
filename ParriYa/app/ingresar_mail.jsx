import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/login.styles';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

export default function IngresarMailScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

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
          Introduce el email con el que te registraste. Te enviaremos un correo con un codigo para que puedas restablecer la contraseña
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
              defaultValue="enzoB@gmail.com" 
              keyboardType="email-address"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.push('/verificacion')}
        >
          <Text style={styles.mainButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}