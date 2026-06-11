import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/fonts';

export default function ExitoScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle-outline" size={100} color={COLORS.efectivo} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>¡Pedido Confirmado!</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Tu orden ha sido registrada exitosamente. Puedes ver el estado de tu pedido en tu historial.
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    marginBottom: 30,
  },
  title: {
    fontFamily: FONTS.family.bold,
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize: FONTS.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontFamily: FONTS.family.bold,
    color: '#FFFFFF',
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
  },
});
