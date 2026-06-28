import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Platform, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Perfil/perfil.styles';
import { useTheme } from '../../components/ThemeContext';
import { COLORS } from '../../constants/colors';

export default function AdminPerfilScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme, textSize, changeTextSize, fontSizeMultiplier, colors } = useTheme();
  const [usuario, setUsuario] = useState({
    username: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        if (stored) {
          const savedUser = JSON.parse(stored);
          setUsuario({
            username: savedUser.username || '',
            email: savedUser.email || '',
            telefono: savedUser.telefono || '',
          });
        }
      } catch (e) {
        // ignore
      }
    }
    loadUser();
  }, []);

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        await AsyncStorage.removeItem('activeUser');
        router.replace('/login');
      } catch (e) {
        console.error(e);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Estás seguro de que deseas salir del panel de administración?');
      if (confirmed) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que deseas salir del panel de administración?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: doLogout,
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CABECERA: Fondo superior con iconos */}
        <View style={styles.headerBackground}>
          <View style={styles.headerIconsRow}>
            {/* Flecha de volver al Backoffice */}
            <TouchableOpacity onPress={() => router.replace('/backoffice')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Tuerca de configuración */}
            <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
              <Ionicons name="settings-sharp" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Avatar del administrador */}
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person"
              size={100}
              color="rgba(255, 255, 255, 0.2)"
              style={styles.avatarIcon}
            />
          </View>
        </View>

        {/* Tarjeta Blanca superpuesta */}
        <View style={[
          styles.contentCard, 
          { 
            backgroundColor: colors.card,
            borderColor: isDarkMode ? colors.border : "transparent",
            borderWidth: isDarkMode ? 1 : 0,
          }
        ]}>
          {/* Campo: Nombre */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { backgroundColor: colors.card, color: colors.textMuted }]}>Nombre</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={usuario.username}
                editable={false}
              />
            </View>
          </View>

          {/* Campo: Email */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { backgroundColor: colors.card, color: colors.textMuted }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={usuario.email}
                editable={false}
              />
            </View>
          </View>

          {/* Campo: Teléfono */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { backgroundColor: colors.card, color: colors.textMuted }]}>Telefono</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={usuario.telefono}
                editable={false}
              />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Enlaces Secundarios */}
          <TouchableOpacity 
            style={styles.menuRow} 
            activeOpacity={0.7}
            onPress={() => router.push('/cambiar_contrasena')}
          >
            <Text style={[styles.menuRowText, { color: colors.textMuted }]}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={18} color={isDarkMode ? colors.text : "#8E8E93"} />
          </TouchableOpacity>

          {/* Botón Cerrar Sesión "Log out" */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            <Ionicons
              name="log-out"
              size={22}
              color={COLORS.primary}
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {menuOpen && (
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && (
        <View style={[styles.dropdownContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <View style={[styles.dropdownRow, { backgroundColor: colors.dropdownRow }]}>
            <Text style={[styles.dropdownText, { color: colors.text }]}>Modo Noche</Text>
            <Switch
              key={isDarkMode ? "switch-active" : "switch-inactive"}
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D1D6", true: COLORS.primary }}
              thumbColor={isDarkMode ? COLORS.primary : "#ffffff"}
            />
          </View>
          <View style={[styles.dropdownCol, { backgroundColor: colors.dropdownRow }]}>
            <Text style={[styles.dropdownTitle, { color: colors.text }]}>Tamaño de letra</Text>
            <View style={styles.btnGroup}>
              {/* Grande */}
              <TouchableOpacity
                style={[styles.sizeBtn, textSize === 'grande' ? styles.sizeBtnActive : styles.sizeBtnInactive]}
                onPress={() => changeTextSize('grande')}
              >
                <Text style={[styles.sizeBtnText, textSize === 'grande' ? styles.sizeBtnTextActive : styles.sizeBtnTextInactive, { fontSize: 20 }]}>
                  aA
                </Text>
              </TouchableOpacity>
 
              {/* Normal */}
              <TouchableOpacity
                style={[styles.sizeBtn, textSize === 'normal' ? styles.sizeBtnActive : styles.sizeBtnInactive]}
                onPress={() => changeTextSize('normal')}
              >
                <Text style={[styles.sizeBtnText, textSize === 'normal' ? styles.sizeBtnTextActive : styles.sizeBtnTextInactive, { fontSize: 15 }]}>
                  aA
                </Text>
              </TouchableOpacity>
 
              {/* Chico */}
              <TouchableOpacity
                style={[styles.sizeBtn, textSize === 'chico' ? styles.sizeBtnActive : styles.sizeBtnInactive]}
                onPress={() => changeTextSize('chico')}
              >
                <Text style={[styles.sizeBtnText, textSize === 'chico' ? styles.sizeBtnTextActive : styles.sizeBtnTextInactive, { fontSize: 11 }]}>
                  aA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
