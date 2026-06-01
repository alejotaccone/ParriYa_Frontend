import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSearch } from "../SearchContext";
import { styles } from "./Header.styles";

const Header = () => {
  const router = useRouter();
  const { busquedaGlobal, setBusquedaGlobal } = useSearch();

  const handleBuscador = () => {
    if (busquedaGlobal.trim()) {
      router.push({
        pathname: '/(tabs)/categoria',
        params: { categoriaSeleccionada: 'Todo' },
      });
    }
  };

  const handleFocusBuscador = () => {
    router.push({
      pathname: '/(tabs)/categoria',
      params: { categoriaSeleccionada: 'Todo' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Parri-Ya!</Text>
          <Text style={styles.addressText}>Habana 3540</Text>
        </View>

        <View style={styles.logoAndCartContainer}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.grillLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar productos"
            style={styles.searchInput}
            placeholderTextColor="gray"
            value={busquedaGlobal}
            onChangeText={setBusquedaGlobal}
            onFocus={handleFocusBuscador}
            onSubmitEditing={handleBuscador}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => router.push('/favoritos')}
        >
          <Ionicons name="heart-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
