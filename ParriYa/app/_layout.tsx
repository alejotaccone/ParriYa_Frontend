import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../components/CartContext';
import { SearchProvider } from '../components/SearchContext';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const u = await AsyncStorage.getItem('activeUser');
        if (u) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        // ignore
      }
    }
    checkUser();
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <SearchProvider>
          <Stack>
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
          </Stack>
        </SearchProvider>
      </CartProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
