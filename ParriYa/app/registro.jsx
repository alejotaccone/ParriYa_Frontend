import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta
import api from '../services/api';

export default function RegistroScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  return (
    <View style={styles.mainContainer}>
      {/* <Image source={require('../assets/images/fondo-auth.png')} style={styles.backgroundImage} resizeMode="cover" /> */}

      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>

        {/* Mapea a la columna 'nombre' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} autoCapitalize="none" />
          </View>
        </View>

        {/* Mapea a la columna 'password_hash' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value={password} onChangeText={setPassword} />
          </View>
        </View>

        {/* Mapea a la columna 'email' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="enzoB@gmail.com" placeholderTextColor="#8E8E93" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>
        </View>

        {/* Mapea a la columna 'telefono' */}
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
              Alert.alert('Completa los campos', 'Debes completar todos los datos para registrarte.');
              return;
            }

            try {
              // Registrar el usuario en el backend
              const response = await api.post('/auth/registro', {
                nombre: username.trim(),
                email: email.trim(),
                password: password,
                telefono: telefono.trim()
              });

              const token = response.data.token;
              await AsyncStorage.setItem('authToken', token);

              // Cargar perfil del usuario registrado
              const profileResponse = await api.get('/usuario/perfil', {
                headers: { Authorization: `Bearer ${token}` }
              });

              const profile = profileResponse.data;
              const userObj = {
                username: profile.nombre,
                email: profile.email,
                rol: profile.rol.toLowerCase(), // 'cliente'
                telefono: profile.telefono,
              };

              await AsyncStorage.setItem('activeUser', JSON.stringify(userObj));
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Error al registrar usuario:', error);
              const errorMsg = error.response?.data?.message || 'No se pudo crear la cuenta. Intenta nuevamente.';
              Alert.alert('Error', errorMsg);
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