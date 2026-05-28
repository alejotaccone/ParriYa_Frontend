import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ headerShown: false }} />
        <Stack.Screen name="carrito" options={{ headerShown: false }} />
        <Stack.Screen name="historial" options={{ headerShown: false }} />
        <Stack.Screen name="detalle_pedido" options={{ headerShown: false }} />
        <Stack.Screen name="detalle" options={{ headerShown: false }} />
        <Stack.Screen name="pago" options={{ headerShown: false }} />



      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
