import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContadorCantidad = ({ cantidad, onIncrement, onDecrement }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrement} style={styles.button}>
        <Ionicons name="remove" size={20} color="#333" />
      </TouchableOpacity>

      <Text style={styles.text}>{cantidad}</Text>

      <TouchableOpacity onPress={onIncrement} style={styles.button}>
        <Ionicons name="add" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  button: {
    width: 35,
    height: 35,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 15,
    color: "#333",
  },
});

export default ContadorCantidad;
