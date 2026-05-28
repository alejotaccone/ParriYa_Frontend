import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta

export default function CambiarContrasenaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Ionicons name="lock-closed" size={150} color="black" style={styles.lockIconBackground} />
      </View>

      <View style={styles.contentCard}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña Actual</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="****************" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Nueva Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value="**************" />
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.forgotRow} 
          onPress={() => router.push('/verificacion')}
        >
          <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}