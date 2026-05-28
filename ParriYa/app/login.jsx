import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      {/* Si exportás el fondo degradado como PNG, descomentá esto: */}
      {/* <Image source={require('../assets/images/fondo-auth.png')} style={styles.backgroundImage} resizeMode="cover" /> */}

      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesion</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.mainButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/ingresar_mail')}>
          <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/registro')}>
          <Text style={styles.footerText}>
            No estas registrado? <Text style={styles.footerTextBold}>Crea tu cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}