import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./Header.styles";

const Header = () => {
  const router = useRouter();

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
            placeholder="Buscar"
            style={styles.searchInput}
            placeholderTextColor="gray"
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
