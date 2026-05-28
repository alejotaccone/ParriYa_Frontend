import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../components/Auth/auth.styles'; // Ajustá esta ruta

export default function VerificacionScreen() {
  const router = useRouter();
  const inputRefs = useRef([]);

  // Pequeña función para que al escribir salte al siguiente cuadradito automáticamente
  const handleTextChange = (text, index) => {
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.verificationContainer}>
      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.backButtonModal} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={40} color="white" />
        </View>

        <Text style={styles.modalTitle}>Codigo enviado!</Text>
        <Text style={styles.modalSubtitle}>
          Revisa tu casilla de mail (<Text style={styles.boldEmail}>enzoB@gmail.com</Text>) e ingresa el codigo de verificación:
        </Text>

        <View style={styles.codeRow}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={styles.codeBox}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleTextChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => router.push('/nueva_contrasena')}
        >
          <Text style={styles.verifyButtonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}