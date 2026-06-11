import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta
import api from '../services/api';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function RegistroScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={styles.mainContainer}>

      <View style={[
        styles.card, 
        { 
          backgroundColor: colors.card, 
          borderColor: isDarkMode ? colors.border : 'transparent', 
          borderWidth: isDarkMode ? 1 : 0 
        }
      ]}>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Usuario</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} placeholder="usuario.123" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} secureTextEntry value={password} onChangeText={setPassword} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Email</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} placeholder="enzoB@gmail.com" placeholderTextColor="#8E8E93" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Telefono</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} placeholder="+54 9 11 1122-3344" placeholderTextColor="#8E8E93" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.mainButton, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={async () => {
            const trimmedUsername = username.trim();
            const trimmedEmail = email.trim();
            const trimmedTelefono = telefono.trim();

            if (!trimmedUsername || !password || !trimmedEmail || !trimmedTelefono) {
              showAlert('Completa los campos', 'Debes completar todos los datos para registrarte.');
              return;
            }

            // Validar Nombre: letras, espacios, acentos (2 a 50 caracteres), y evitar el carácter '@'
            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' -]{2,50}$/;
            if (!nombreRegex.test(trimmedUsername) || trimmedUsername.includes('@')) {
              showAlert('Nombre inválido', 'El nombre solo puede contener letras y espacios, y debe tener entre 2 y 50 caracteres.');
              return;
            }

            // Validar Email con regex estándar
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
              showAlert('Email inválido', 'Por favor, ingresa un correo electrónico con formato válido.');
              return;
            }

            // Validar Teléfono: entre 7 y 20 caracteres (números, espacios, guiones, paréntesis y opcionalmente +)
            const telefonoRegex = /^\+?[0-9\s\-()]{7,20}$/;
            if (!telefonoRegex.test(trimmedTelefono)) {
              showAlert('Teléfono inválido', 'Por favor, ingresa un número de teléfono válido (mínimo 7 dígitos).');
              return;
            }

            // Validar Contraseña (mínimo 6 caracteres)
            if (password.length < 6) {
              showAlert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
              return;
            }

            // Validar que la contraseña no sea idéntica al correo electrónico ni al nombre de usuario
            if (password.trim().toLowerCase() === trimmedEmail.toLowerCase()) {
              showAlert('Contraseña inválida', 'La contraseña no puede ser igual al correo electrónico.');
              return;
            }
            if (password.trim().toLowerCase() === trimmedUsername.toLowerCase()) {
              showAlert('Contraseña inválida', 'La contraseña no puede ser igual al nombre de usuario.');
              return;
            }

            setLoading(true);
            try {
              const response = await api.post('/auth/registro', {
                nombre: trimmedUsername,
                email: trimmedEmail,
                password: password,
                telefono: trimmedTelefono
              });

              const token = response.data.token;
              await AsyncStorage.setItem('authToken', token);

              const profileResponse = await api.get('/usuario/perfil', {
                headers: { Authorization: `Bearer ${token}` }
              });

              const profile = profileResponse.data;
              const userObj = {
                username: profile.nombre,
                email: profile.email,
                rol: profile.rol.toLowerCase(),
                telefono: profile.telefono,
              };

              await AsyncStorage.setItem('activeUser', JSON.stringify(userObj));
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Error al registrar usuario:', error);
              const errorMsg = error.response?.data?.error || error.response?.data?.message || 'No se pudo crear la cuenta. Intenta nuevamente.';
              showAlert('Error', errorMsg);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.mainButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Ya tenes cuenta? <Text style={styles.footerTextBold}>Inicia sesion</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}