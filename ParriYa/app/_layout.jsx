import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  useFonts,
  Epilogue_400Regular,
  Epilogue_500Medium,
  Epilogue_600SemiBold,
  Epilogue_700Bold 
} from '@expo-google-fonts/epilogue';
import { Lobster_400Regular } from '@expo-google-fonts/lobster';

import { CartProvider } from '../components/CartContext';
import { SearchProvider } from '../components/SearchContext';
import { ThemeProvider as AppThemeProvider, useTheme as useAppTheme } from '../components/ThemeContext';

// Previene que el Splash Screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

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

        const segs = segments;
        const inBackoffice = segs[0] === 'backoffice';
        const inTabs = segs[0] === '(tabs)';
        const isAuthRoute = ['login', 'registro', 'ingresar_mail', 'verificacion', 'nueva_contrasena'].includes(segs[0] || '');

        const isCommonRoute = ['cambiar_contrasena', 'verificacion', 'nueva_contrasena'].includes(segs[0] || '');

        if (userObj) {
          if (userObj.rol === 'admin') {
            if (!inBackoffice && !isCommonRoute) {
              router.replace('/backoffice');
            }
          } else {
            if (inBackoffice || isAuthRoute) {
              router.replace('/(tabs)');
            }
          }
        } else {
          const isPublic = segs.length === 0 || segs[0] === 'index' || isAuthRoute;
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

function InnerRootLayout() {
  const { isDarkMode } = useAppTheme();
  const [fontsLoaded, fontError] = useFonts({
    Epilogue_400Regular,
    Epilogue_500Medium,
    Epilogue_600SemiBold,
    Epilogue_700Bold,
    Lobster_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <SearchProvider>
          <RootLayoutNav />
        </SearchProvider>
      </CartProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <InnerRootLayout />
    </AppThemeProvider>
  );
}
