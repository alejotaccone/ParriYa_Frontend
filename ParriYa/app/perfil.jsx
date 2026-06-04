import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/Perfil/perfil.styles";

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({
    username: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem('activeUser');
        if (!stored) {
          router.replace('/login');
          return;
        }
        const savedUser = JSON.parse(stored);
        setUsuario({
          username: savedUser.username || '',
          email: savedUser.email || '',
          telefono: savedUser.telefono || '',
        });
      } catch (e) {
        router.replace('/login');
      }
    }

    loadUser();
  }, [router]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CABECERA: Fondo superior con iconos */}
        <View style={styles.headerBackground}>
          <View style={styles.headerIconsRow}>
            
            {/* Flecha de volver CORREGIDA */}
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Tuerca de configuración */}
            <TouchableOpacity>
              <Ionicons name="settings-sharp" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Avatar del usuario */}
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person"
              size={100}
              color="rgba(255, 255, 255, 0.2)"
              style={styles.avatarIcon}
            />
          </View>
        </View>

        {/*Tarjeta Blanca superpuesta */}
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

          <TouchableOpacity 
            style={styles.menuRow} 
            activeOpacity={0.7}
            onPress={() => router.push('/historial')} 
          >
            <Text style={styles.menuRowText}>Historial de compras</Text>
            <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
          </TouchableOpacity>

          {/* Botón Cerrar Sesión (Naranja) */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem('activeUser');
              } catch (e) {
              }
              router.replace('/login');
            }}
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
