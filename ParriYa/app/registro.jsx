import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta

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
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} />
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
            <TextInput style={styles.textInput} placeholder="enzoB@gmail.com" placeholderTextColor="#8E8E93" keyboardType="email-address" value={email} onChangeText={setEmail} />
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

            const user = { username, password, email, telefono };
            try {
              await AsyncStorage.setItem('registeredUser', JSON.stringify(user));
              await AsyncStorage.setItem('activeUser', JSON.stringify(user));
              router.replace('/(tabs)');
            } catch (e) {
              Alert.alert('Error', 'No se pudo guardar la cuenta. Intenta nuevamente.');
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