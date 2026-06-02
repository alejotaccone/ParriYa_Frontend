import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../components/CartContext';
import { SearchProvider } from '../components/SearchContext';

export const unstable_settings = {
  anchor: 'login',
};

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function checkUser() {
      try {
        const u = await AsyncStorage.getItem('activeUser');
        const userObj = u ? JSON.parse(u) : null;

        const inBackoffice = segments[0] === 'backoffice';
        const inTabs = segments[0] === '(tabs)';
        const isAuthRoute = ['login', 'registro', 'ingresar_mail', 'verificacion', 'nueva_contrasena'].includes(segments[0] || '');

        if (userObj) {
          if (userObj.rol === 'admin') {
            if (!inBackoffice) {
              router.replace('/backoffice');
            }
          } else {
            if (inBackoffice || isAuthRoute) {
              router.replace('/(tabs)');
            }
          }
        } else {
          const isPublic = segments.length === 0 || segments[0] === 'index' || isAuthRoute;
          if (!isPublic) {
            router.replace('/login');
          }
        }
      } catch (e) {
        // ignore
      }
    }
    checkUser();
  }, [segments, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
      <Stack.Screen name="carrito" options={{ headerShown: false }} />
      <Stack.Screen name="historial" options={{ headerShown: false }} />
      <Stack.Screen name="detalle_pedido" options={{ headerShown: false }} />
      <Stack.Screen name="detalle" options={{ headerShown: false }} />
      <Stack.Screen name="pago" options={{ headerShown: false }} />
      <Stack.Screen name="favoritos" options={{ headerShown: false }} />
      <Stack.Screen name="cambiar_contrasena" options={{ headerShown: false }} />
      <Stack.Screen name="verificacion" options={{ headerShown: false }} />
      <Stack.Screen name="nueva_contrasena" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ headerShown: false }} />
      <Stack.Screen name="ingresar_mail" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/index" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/pedidos" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/reservas" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/feedback" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/productos" options={{ headerShown: false }} />
      <Stack.Screen name="backoffice/perfil" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <SearchProvider>
          <RootLayoutNav />
        </SearchProvider>
      </CartProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
