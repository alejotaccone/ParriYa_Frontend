import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Contenedor de la imagen principal con fondo gris claro
  imageContainer: {
    backgroundColor: "#F5F5F5",
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 50, // Espacio para el notch/estado del celu
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  mainImage: {
    width: "80%",
    height: "80%",
  },
  // Información del producto
  infoContainer: {
    padding: 25,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#555555",
    lineHeight: 22,
  },
  // Selector de cantidad y precio final
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "white",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B2610", // Tu marrón característico
  },
  // Botón Agregar
  addButton: {
    backgroundColor: "#4B2610",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4B2610",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Cambiado a flex-start para que el contador no se mueva al desplegar la lista
    marginTop: 25,
    position: "relative", // Para contener elementos absolutos si hiciera falta
    zIndex: 50,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 15,
    zIndex: 100, // Asegura que la lista se dibuje por encima de lo que haya abajo
  },
  cantidadWrapper: {
    alignItems: "center",
    zIndex: 10,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  // Botón por defecto (Cerrado)
  dropdownSimulado: {
    backgroundColor: "#04332D", // Verde oscuro
    borderRadius: 25, // Bordes bien redondeados como tu primera foto
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // Estilo alternativo cuando está abierto (Bordes menos redondeados abajo o outline sutil si querés)
  dropdownAbierto: {
    borderWidth: 1,
    borderColor: "#04332D",
    backgroundColor: "#04332D",
    borderRadius: 20,
  },
  dropdownText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  // CONTENEDOR DE LA LISTA DESPLEGABLE (La caja grande de tu segunda imagen)
  dropdownOptionsContainer: {
    backgroundColor: "#04332D",
    borderRadius: 20,
    marginTop: 8,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  // Botón para cada opción interna
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  // Texto de las opciones ("Jugoso", "A punto", "Cocido")
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
});
