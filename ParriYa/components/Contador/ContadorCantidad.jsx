import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "./ContadorCantidad.styles";
import { useTheme } from "../ThemeContext";

const ContadorCantidad = ({ cantidad, onIncrement, onDecrement }) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.box }]}>
      <TouchableOpacity onPress={onDecrement} style={[styles.button, { backgroundColor: colors.card }]}>
        <Ionicons name="remove" size={20} color={isDarkMode ? "#ffffff" : COLORS.textMain} />
      </TouchableOpacity>

      <Text style={[styles.text, { color: colors.text }]}>{cantidad}</Text>

      <TouchableOpacity onPress={onIncrement} style={[styles.button, { backgroundColor: colors.card }]}>
        <Ionicons name="add" size={20} color={isDarkMode ? "#ffffff" : COLORS.textMain} />
      </TouchableOpacity>
    </View>
  );
};

export default ContadorCantidad;
