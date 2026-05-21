import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Header Naranja
  header: {
    backgroundColor: "#E76F41",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginRight: 35, // Para compensar el espacio del botón volver y que quede centrado
  },
  // Info de entrega
  deliveryInfo: {
    alignItems: "center",
    marginVertical: 15,
  },
  deliveryMethod: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  deliveryTime: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  // Lista de productos
  productsList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // Contenedor de sugerencias "¿Querés agregar algo más?"
  suggestionsContainer: {
    marginBottom: 25,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 15,
  },
  suggestionsList: {
    paddingLeft: 20,
  },
  suggestionCard: {
    width: 140,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionImageContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionImage: {
    width: "100%",
    height: "100%",
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
  },
  // Sección Resumen de Pago
  resumenContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resumenLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  resumenValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 15,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  subtotalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  payButton: {
    backgroundColor: "#E76F41", // El naranja de tus botones principales
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
