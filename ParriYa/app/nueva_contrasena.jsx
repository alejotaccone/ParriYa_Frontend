import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta

export default function NuevaContrasenaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        {/* Usamos el candado abierto para esta pantalla */}
        <Ionicons name="lock-open" size={150} color="black" style={styles.lockIconBackground} />
      </View>

      <View style={styles.contentCard}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => router.push('/(tabs)')} // O a donde quieras que vaya al terminar
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}