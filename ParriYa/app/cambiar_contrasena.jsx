import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta
import api from '../services/api';

export default function CambiarContrasenaScreen() {
  const router = useRouter();
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [confirmarPasswordNuevo, setConfirmarPasswordNuevo] = useState('');
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null);

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
    } else {
      if (rol === 'admin') {
        router.replace('/backoffice/perfil');
      } else {
        router.replace('/perfil');
      }
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
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Ionicons name="lock-closed" size={150} color="black" style={styles.lockIconBackground} />
      </View>

      <View style={styles.contentCard}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña Actual</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              secureTextEntry 
              placeholder="Contraseña actual"
              placeholderTextColor="#8E8E93"
              value={passwordActual}
              onChangeText={setPasswordActual}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Nueva Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              secureTextEntry 
              placeholder="Nueva contraseña"
              placeholderTextColor="#8E8E93"
              value={passwordNuevo}
              onChangeText={setPasswordNuevo}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              secureTextEntry 
              placeholder="Repetir nueva contraseña"
              placeholderTextColor="#8E8E93"
              value={confirmarPasswordNuevo}
              onChangeText={setConfirmarPasswordNuevo}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.confirmButton}
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