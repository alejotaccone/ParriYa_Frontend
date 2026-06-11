import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

export default function NuevaContrasenaScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        {/* Usamos el candado abierto para esta pantalla */}
        <Ionicons name="lock-open" size={150} color="black" style={styles.lockIconBackground} />
      </View>

      <View style={[
        styles.contentCard, 
        { 
          backgroundColor: colors.card, 
          borderTopColor: isDarkMode ? colors.border : 'transparent', 
          borderTopWidth: isDarkMode ? 1 : 0 
        }
      ]}>
        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Nueva contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} secureTextEntry value="**************" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Confirmar nueva contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} secureTextEntry value="**************" />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}