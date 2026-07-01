import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta
import api from '../services/api';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CambiarContrasenaScreen() {
  const router = useRouter();
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [confirmarPasswordNuevo, setConfirmarPasswordNuevo] = useState('');
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadRole() {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        if (stored) {
          const userObj = JSON.parse(stored);
          setRol(userObj.rol?.toLowerCase() || 'cliente');
        }
      } catch (e) {
        console.error('Error al cargar el rol:', e);
      }
    }
    loadRole();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (rol === 'admin') {
      router.replace('/backoffice/perfil');
    } else {
      router.replace('/perfil');
    }
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleConfirm = async () => {
    if (!passwordActual || !passwordNuevo || !confirmarPasswordNuevo) {
      showAlert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    if (passwordNuevo !== confirmarPasswordNuevo) {
      showAlert('Error', 'La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (passwordActual === passwordNuevo) {
      showAlert('Error', 'La nueva contraseña no puede ser igual a la contraseña actual.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/usuario/password', {
        passwordActual: passwordActual,
        passwordNuevo: passwordNuevo
      });

      showAlert('Contraseña cambiada', 'Tu contraseña ha sido actualizada con éxito.');
      handleBack();
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.response?.data || 'No se pudo actualizar la contraseña. Revisa tus credenciales.';
      showAlert('Error', typeof errorMsg === 'string' ? errorMsg : 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Ionicons name="lock-closed" size={150} color="black" style={styles.lockIconBackground} />
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
        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Contraseña Actual</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput 
              style={[styles.textInput, { color: colors.text }]} 
              secureTextEntry 
              placeholder="Contraseña actual"
              placeholderTextColor="#8E8E93"
              value={passwordActual}
              onChangeText={setPasswordActual}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Nueva Contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput 
              style={[styles.textInput, { color: colors.text, flex: 1 }]} 
              secureTextEntry={!showNuevo}
              placeholder="Nueva contraseña"
              placeholderTextColor="#8E8E93"
              value={passwordNuevo}
              onChangeText={setPasswordNuevo}
            />
            <TouchableOpacity onPress={() => setShowNuevo(!showNuevo)} style={{ paddingLeft: 8 }}>
              <Ionicons
                name={showNuevo ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textMuted || '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Confirmar Nueva Contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput 
              style={[styles.textInput, { color: colors.text, flex: 1 }]} 
              secureTextEntry={!showConfirmar}
              placeholder="Repetir nueva contraseña"
              placeholderTextColor="#8E8E93"
              value={confirmarPasswordNuevo}
              onChangeText={setConfirmarPasswordNuevo}
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

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <TouchableOpacity 
          style={[styles.confirmButton, { bottom: 20 + insets.bottom }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Confirmando...' : 'Confirmar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}