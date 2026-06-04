import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/login.styles';

export default function IngresarMailScreen() {
  const router = useRouter();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={35} color="white" />
        </View>

        <Text style={styles.title}>Ingresa tu email</Text>
        
        <Text style={styles.subtitle}>
          Introduce el email con el que te registraste. Te enviaremos un correo con un codigo para que puedas restablecer la contraseña
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              defaultValue="enzoB@gmail.com" 
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Al tocar enviar, conectamos con la pantalla de verificación que ya tenés armada */}
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.push('/verificacion')}
        >
          <Text style={styles.mainButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}