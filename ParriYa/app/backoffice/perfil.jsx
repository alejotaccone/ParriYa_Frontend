import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Perfil/perfil.styles';

export default function AdminPerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({
    username: 'Admin123',
    email: 'admin123@gmail.com',
    telefono: '+54 9 11 1234-5678',
    direccion: 'Lima 757, C1073 Cdad. Autónoma de Buenos Aires',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        if (stored) {
          const savedUser = JSON.parse(stored);
          setUsuario({
            username: savedUser.username === 'admin' ? 'Admin123' : savedUser.username || 'Admin123',
            email: savedUser.email === 'admin@parriya.com' ? 'admin123@gmail.com' : savedUser.email || 'admin123@gmail.com',
            telefono: savedUser.telefono || '+54 9 11 1234-5678',
            direccion: savedUser.direccion || 'Lima 757, C1073 Cdad. Autónoma de Buenos Aires',
          });
        }
      } catch (e) {
        // ignore
      }
    }
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir del panel de administración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('activeUser');
              router.replace('/login');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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
            <TouchableOpacity>
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
        <View style={styles.contentCard}>
          {/* Campo: Nombre */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={usuario.username}
                editable={false}
              />
            </View>
          </View>

          {/* Campo: Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={usuario.email}
                editable={false}
              />
            </View>
          </View>

          {/* Campo: Dirección */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Dirreccion</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={usuario.direccion}
                editable={false}
                multiline={true}
              />
            </View>
          </View>

          {/* Campo: Teléfono */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Telefono</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={usuario.telefono}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Enlaces Secundarios */}
          <TouchableOpacity 
            style={styles.menuRow} 
            activeOpacity={0.7}
            onPress={() => router.push('/cambiar_contrasena')}
          >
            <Text style={styles.menuRowText}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>

          {/* Botón Cerrar Sesión "Log out" */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesion</Text>
            <Ionicons
              name="log-out"
              size={22}
              color="#E76F41"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
