import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let checkDone = false;
    let targetRoute = '/login';

    // 1. Iniciar la verificación del usuario en AsyncStorage en paralelo
    async function checkUser() {
      try {
        const activeUser = await AsyncStorage.getItem('activeUser');
        if (activeUser) {
          const userObj = JSON.parse(activeUser);
          // Si el usuario es administrador, lo mandamos al backoffice
          if (userObj && userObj.rol === 'admin') {
            targetRoute = '/backoffice';
          } else {
            targetRoute = '/(tabs)';
          }
        } else {
          targetRoute = '/login';
        }
      } catch (e) {
        targetRoute = '/login';
      } finally {
        checkDone = true;
      }
    }
    
    checkUser();

    // 2. Temporizador estricto de 2.5 segundos (2500 ms) para el splash
    const timer = setTimeout(() => {
      const navigateWhenReady = () => {
        if (checkDone) {
          router.replace(targetRoute);
        } else {
          setTimeout(navigateWhenReady, 50);
        }
      };
      navigateWhenReady();
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={require('../assets/images/splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Ocultamos el Header nativo de Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Barra de estado translúcida para inmersión */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#260C05', // Color de respaldo marrón
    width: '100%',
    height: '100%',
  },
});
