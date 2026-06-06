import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "./ContadorCantidad.styles";

const ContadorCantidad = ({ cantidad, onIncrement, onDecrement }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrement} style={styles.button}>
        <Ionicons name="remove" size={20} color={COLORS.textMain} />
      </TouchableOpacity>

      <Text style={styles.text}>{cantidad}</Text>

      <TouchableOpacity onPress={onIncrement} style={styles.button}>
        <Ionicons name="add" size={20} color={COLORS.textMain} />
      </TouchableOpacity>
    </View>
  );
};

export default ContadorCantidad;

