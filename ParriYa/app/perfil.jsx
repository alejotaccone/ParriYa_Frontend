import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/Perfil/perfil.styles";

export default function PerfilScreen() {
  const router = useRouter();

  const usuario = {
    nombre: "Enzo Mussi",
    email: "Enzo@gmail.com",
    direccion: "Lima 757, C1073 Cdad. Autónoma de Buenos Aires",
    telefono: "+54 9 11 1234-5678",
  };

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
            <TouchableOpacity onPress={() => router.replace('/')}>
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
                value={usuario.nombre}
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
            <Text style={styles.inputLabel}>Direccion</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={usuario.direccion}
                editable={false}
                multiline={true} // Permite que el texto baje si es muy largo
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
            onPress={() => router.push('/cambiar_contrasena')} // <--- AGREGAR ESTA LÍNEA
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
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>Cerrar Sesion</Text>
            <Ionicons
              name="log-out-outline"
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
