import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Ocultamos el header feo que viene por defecto, porque ya hiciste el tuyo naranja
        headerShown: false, 
        
        // Estilo de la barra inferior
        tabBarStyle: {
          backgroundColor: '#4B2610', // Marrón oscuro como en tu diseño
          borderTopWidth: 0,
          height: 65, 
          paddingBottom: 10,
          paddingTop: 10,
        },
        
        // Naranja cuando estás en esa pestaña, blanco cuando no
        tabBarActiveTintColor: '#E76F41', 
        tabBarInactiveTintColor: 'white',
        
        // Ocultamos las letritas de abajo para que quede limpio (solo iconos)
        tabBarShowLabel: false, 
      }}
    >
      {/* Pestaña 1: Inicio (lee automáticamente el archivo index.jsx que ya tenés) */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />
      
      {/* Pestaña 2: Carrito (va a buscar el archivo carrito.jsx) */}
      <Tabs.Screen
        name="carrito"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={30} color={color} />
          ),
        }}
      />
      
      {/* Pestaña 3: Perfil (va a buscar el archivo perfil.jsx) */}
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
      {/* Pestaña oculta: Categorías (No aparece en la barra, pero se puede navegar hacia ella) */}
      <Tabs.Screen
        name="categoria"
        options={{
          href: null, // ¡ESTA ES LA MAGIA! Evita que se cree un botón en la barra
        }}
      />
    </Tabs>
    
  );
}