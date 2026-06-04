import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta
import api from '../services/api';

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

  return (
    <View style={styles.mainContainer}>

      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value={password} onChangeText={setPassword} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="enzoB@gmail.com" placeholderTextColor="#8E8E93" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Telefono</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="+54 9 11 1122-3344" placeholderTextColor="#8E8E93" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={async () => {
            if (!username || !password || !email || !telefono) {
              showAlert('Completa los campos', 'Debes completar todos los datos para registrarte.');
              return;
            }

            try {
              const response = await api.post('/auth/registro', {
                nombre: username.trim(),
                email: email.trim(),
                password: password,
                telefono: telefono.trim()
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
            }
          }}
        >
          <Text style={styles.mainButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.footerText}>
            Ya tenes cuenta? <Text style={styles.footerTextBold}>Inicia sesion</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}