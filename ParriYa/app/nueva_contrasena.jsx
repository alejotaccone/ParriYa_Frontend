import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../services/api';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function NuevaContrasenaScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    if (!nuevaPassword || !confirmarPassword) {
      showAlert('Campos vacíos', 'Por favor completá ambos campos.');
      return;
    }
    if (nuevaPassword.length < 6) {
      showAlert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      showAlert('No coinciden', 'Las contraseñas no coinciden. Verificá e intentá de nuevo.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/cambiar-password', {
        email: email,
        password: nuevaPassword,
      });
      showAlert('¡Listo!', 'Tu contraseña fue actualizada correctamente.');
      router.replace('/login');
    } catch (error) {
      showAlert('Error', 'No se pudo cambiar la contraseña. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Ionicons name="lock-open" size={150} color="black" style={styles.lockIconBackground} />
      </View>

      <View style={[
        styles.contentCard,
        {
          backgroundColor: colors.card,
          borderTopColor: isDarkMode ? colors.border : 'transparent',
          borderTopWidth: isDarkMode ? 1 : 0,
          paddingBottom: 40 + insets.bottom
        }
      ]}>
        {/* Nueva contraseña */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { backgroundColor: colors.card, color: colors.textMuted }]}>
            Nueva contraseña
          </Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text, flex: 1 }]}
              secureTextEntry={!showNueva}
              value={nuevaPassword}
              onChangeText={setNuevaPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity onPress={() => setShowNueva(!showNueva)} style={{ paddingLeft: 8 }}>
              <Ionicons
                name={showNueva ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textMuted || '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirmar contraseña */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { backgroundColor: colors.card, color: colors.textMuted }]}>
            Confirmar nueva contraseña
          </Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text, flex: 1 }]}
              secureTextEntry={!showConfirmar}
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              placeholder="Repetí la contraseña"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity onPress={() => setShowConfirmar(!showConfirmar)} style={{ paddingLeft: 8 }}>
              <Ionicons
                name={showConfirmar ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textMuted || '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, { bottom: 20 + insets.bottom }, loading && { opacity: 0.7 }]}
          onPress={handleConfirmar}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.confirmButtonText}>Confirmar</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}
