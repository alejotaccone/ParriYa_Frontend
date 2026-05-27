import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Temporizador: a los 2.5 segundos (2500ms) navega a tus tabs
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    // Limpieza de seguridad
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Oculta la barra superior del celu (hora, batería, señal) */}
      <StatusBar hidden={true} /> 
      
      <Image
        // Llama a la imagen completa que guardaste en el Paso 1
        source={require('../assets/images/splash.png')} 
        style={styles.image}
        resizeMode="cover" // Hace que ocupe todo el alto y ancho sin deformarse
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B2610', // Fondo de respaldo
  },
  image: {
    width: '100%',
    height: '100%',
  },
});