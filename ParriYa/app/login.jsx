import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles';
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

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        <Text style={styles.title}>Iniciar Sesion</Text>

        <View style={styles.inputWrapper}>
          <Text style={[
            styles.inputLabel, 
            { 
              backgroundColor: colors.card, 
              color: colors.textMuted 
            }
          ]}>Email / Usuario</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput style={[styles.textInput, { color: colors.text }]} placeholder="usuario@mail.com" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} autoCapitalize="none" keyboardType="email-address" />
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

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={async () => {
            if (!username || !password) {
              showAlert('Completa los campos', 'Debes ingresar email y contraseña.');
              return;
            }

            try {
              const response = await api.post('/auth/login', {
                email: username.trim(),
                password: password
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
              
              if (userObj.rol === 'admin') {
                router.replace('/backoffice');
              } else {
                router.replace('/(tabs)');
              }
            } catch (error) {
              console.error('Error al iniciar sesión:', error);
              const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Usuario o contraseña incorrectos. Intenta de nuevo.';
              showAlert('Error de autenticación', errorMsg);
            }
          }}
        >
          <Text style={styles.mainButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/ingresar_mail')}>
          <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/registro')}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            No estas registrado? <Text style={styles.footerTextBold}>Crea tu cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}