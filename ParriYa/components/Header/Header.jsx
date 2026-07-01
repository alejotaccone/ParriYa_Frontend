import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSearch } from "../SearchContext";
import { useTheme } from "../ThemeContext";
import { styles } from "./Header.styles";
import { COLORS } from "../../constants/colors";

const Header = () => {
  const router = useRouter();
  const { busquedaGlobal, setBusquedaGlobal } = useSearch();
  const { colors, isDarkMode } = useTheme();

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
          <Text style={styles.addressText}>Urquiza 1005, Quilmes</Text>
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
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDarkMode ? colors.textMuted : "gray"}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar productos"
            style={[styles.searchInput, { color: colors.text }]}
            placeholderTextColor={isDarkMode ? colors.textMuted : "gray"}
            value={busquedaGlobal}
            onChangeText={setBusquedaGlobal}
            onFocus={handleFocusBuscador}
            onSubmitEditing={handleBuscador}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.favoritesButton,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            },
          ]}
          onPress={() => router.push('/favoritos')}
        >
          <Ionicons name="heart-outline" size={24} color={isDarkMode ? COLORS.corazonHeaderDark : COLORS.corazonHeaderLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
