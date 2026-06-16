import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { useCart } from '../../components/CartContext';

interface TabBarIconProps {
  color: string;
}

const HomeIcon = ({ color }: TabBarIconProps) => (
  <Ionicons name="home-outline" size={28} color={color} />
);

const CartIcon = ({ color }: TabBarIconProps) => (
  <Ionicons name="cart-outline" size={30} color={color} />
);

const PersonIcon = ({ color }: TabBarIconProps) => (
  <Ionicons name="person-outline" size={28} color={color} />
);

export default function TabLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
      
        tabBarStyle: {
          backgroundColor: '#4B2610', 
          borderTopWidth: 0,
          height: 65, 
          paddingBottom: 10,
          paddingTop: 10,
        },
        
        tabBarActiveTintColor: '#E76F41', 
        tabBarInactiveTintColor: 'white',
        
        tabBarShowLabel: false, 
      }}
    >
      {/* Pestaña 1: Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      
      {/* Pestaña 2: Carrito */}
      <Tabs.Screen
        name="carrito_oculto"
        options={{
          href: '/carrito', 
          tabBarIcon: CartIcon,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
        }}
      />
      
      {/* Pestaña 3: Perfil */}
      <Tabs.Screen
        name="perfil_oculto" 
        options={{
          href: '/perfil', 
          tabBarIcon: PersonIcon,
        }}
      />
      {/* Pestaña oculta: Categorías  */}
      <Tabs.Screen
        name="categoria"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          href: null,
        }}
      />
    </Tabs>
    
  );
}