import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta

export default function RegistroScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      {/* <Image source={require('../assets/images/fondo-auth.png')} style={styles.backgroundImage} resizeMode="cover" /> */}

      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>

        {/* Mapea a la columna 'nombre' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" />
          </View>
        </View>

        {/* Mapea a la columna 'password_hash' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        {/* Mapea a la columna 'email' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="enzoB@gmail.com" placeholderTextColor="#8E8E93" keyboardType="email-address" />
          </View>
        </View>

        {/* Mapea a la columna 'telefono' */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Telefono</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="+54 9 11 1122-3344" placeholderTextColor="#8E8E93" keyboardType="phone-pad" />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.replace('/(tabs)')}
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