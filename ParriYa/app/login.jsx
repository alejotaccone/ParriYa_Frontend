import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../components/Auth/login.styles'; // Ajustá la ruta

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.mainContainer}>
      {/* Si exportás el fondo degradado como PNG, descomentá esto: */}
      {/* <Image source={require('../assets/images/fondo-auth.png')} style={styles.backgroundImage} resizeMode="cover" /> */}

      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesion</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Usuario</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} placeholder="usuario.123" placeholderTextColor="#8E8E93" value={username} onChangeText={setUsername} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput} secureTextEntry value={password} onChangeText={setPassword} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={async () => {
            if (!username || !password) {
              showAlert('Completa los campos', 'Debes ingresar usuario y contraseña.');
              return;
            }

            try {
              // 1. Acceso de prueba rápido para el Administrador
              if (username.toLowerCase() === 'admin') {
                const adminUser = {
                  username: 'admin',
                  email: 'admin@parriya.com',
                  rol: 'admin'
                };
                await AsyncStorage.setItem('activeUser', JSON.stringify(adminUser));
                router.replace('/backoffice');
                return;
              }

              const stored = await AsyncStorage.getItem('registeredUser');
              if (!stored) {
                showAlert('Usuario no registrado', 'Primero crea una cuenta para poder ingresar.');
                return;
              }

              let savedUser;
              try {
                savedUser = JSON.parse(stored);
              } catch (parseError) {
                showAlert('Error de cuenta', 'No se pudo leer la cuenta registrada.');
                return;
              }

              if (!savedUser?.username || !savedUser?.password) {
                showAlert('Usuario no registrado', 'No se encontró una cuenta válida.');
                return;
              }

              if (savedUser.username !== username) {
                showAlert('Usuario incorrecto', 'El usuario ingresado no coincide con la cuenta registrada.');
                return;
              }

              if (savedUser.password !== password) {
                showAlert('Contraseña incorrecta', 'La contraseña no coincide. Intenta de nuevo.');
                return;
              }

              await AsyncStorage.setItem('activeUser', JSON.stringify(savedUser));
              
              // 2. Redirección basada en Rol de la base de datos (rol === 'admin')
              if (savedUser.rol === 'admin') {
                router.replace('/backoffice');
              } else {
                router.replace('/(tabs)');
              }
            } catch (error) {
              showAlert('Error', 'Ocurrió un problema al verificar tu cuenta.');
            }
          }}
        >
          <Text style={styles.mainButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/ingresar_mail')}>
          <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/registro')}>
          <Text style={styles.footerText}>
            No estas registrado? <Text style={styles.footerTextBold}>Crea tu cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}