import * as ReactNative from 'react-native';
import React, { useEffect } from 'react';

// Monkey-patch global para aplicar Epilogue y mapear los pesos (weights) automáticamente
const OriginalText = ReactNative.Text;
const OriginalTextInput = ReactNative.TextInput;

const patchStyle = (style) => {
  const flatStyle = ReactNative.StyleSheet.flatten(style);
  let fontFamily = 'Epilogue_400Regular';
  let overrideWeight = false;

  if (flatStyle) {
    if (flatStyle.fontWeight === 'bold' || flatStyle.fontWeight === '700') {
      fontFamily = 'Epilogue_700Bold';
      overrideWeight = true;
    } else if (flatStyle.fontWeight === '600') {
      fontFamily = 'Epilogue_600SemiBold';
      overrideWeight = true;
    } else if (flatStyle.fontWeight === '500') {
      fontFamily = 'Epilogue_500Medium';
      overrideWeight = true;
    } else if (flatStyle.fontFamily) {
      fontFamily = flatStyle.fontFamily;
    }
  }

  return [
    { fontFamily },
    style,
    overrideWeight ? { fontWeight: undefined } : null
  ];
};

const CustomText = (props) => {
  const { style, children, ...rest } = props;
  return <OriginalText {...rest} style={patchStyle(style)}>{children}</OriginalText>;
};

const CustomTextInput = (props) => {
  const { style, ...rest } = props;
  return <OriginalTextInput {...rest} style={patchStyle(style)} />;
};

try {
  console.log('--- PATCH DE FUENTES ACTIVADO ---');
  ReactNative.Text = CustomText;
  ReactNative.TextInput = CustomTextInput;
} catch (e) {
  console.error("Error al aplicar patch de fuentes:", e);
}

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

import { useColorScheme } from '../hooks/use-color-scheme';
import { CartProvider } from '../components/CartContext';
import { SearchProvider } from '../components/SearchContext';

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Epilogue_400Regular,
    Epilogue_500Medium,
    Epilogue_600SemiBold,
    Epilogue_700Bold,
  });

  console.log('--- ROOT LAYOUT EVALUADO ---, fontsLoaded:', fontsLoaded, 'fontError:', fontError);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Oculta el Splash Screen cuando las fuentes terminen de cargar (o falle la carga)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Si las fuentes no han cargado y no hay error, mantenemos la pantalla del splash
  if (!fontsLoaded && !fontError) {
    return null;
  }

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
