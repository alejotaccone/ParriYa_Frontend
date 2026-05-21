import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilo por defecto para la grilla (ocupa el espacio disponible)
  cardGrid: {
    flex: 1,
  },
  // Estilo para la Home (ancho fijo para el carrusel horizontal)
  cardHome: {
    width: 160,
    marginRight: 15, // Espacio entre tarjetas en el carrusel
  },
  imageContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    marginBottom: 10,
  },
  heartIcon: {
    alignSelf: "flex-end",
  },
});
