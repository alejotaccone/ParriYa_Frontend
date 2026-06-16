import React, { useEffect } from 'react';
import { StatusBar, ImageBackground } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/styles/splash.styles';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let checkDone = false;
    let targetRoute = '/login';

    async function checkUser() {
      try {
        const activeUser = await AsyncStorage.getItem('activeUser');
        if (activeUser) {
          const userObj = JSON.parse(activeUser);
          if (userObj?.rol === 'admin') {
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

