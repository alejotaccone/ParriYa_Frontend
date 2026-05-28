import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
    cardContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FEEFEA", // Lo dejamos fijo por ser un fondo muy específico
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  price: {
    fontSize: FONTS.small, // Antes: 13 (lo unificamos a la escala general)
    fontWeight: "bold",
    color: COLORS.primary, // Antes: "#E76F41"
  },
  name: {
    fontSize: FONTS.body, // Antes: 15
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
    marginTop: 2,
  },
  description: {
    fontSize: FONTS.xSmall, // Antes: 12
    color: COLORS.textMuted, // Antes: "#8E8E93"
    marginTop: 1,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray, // Antes: "#F5F5F5"
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  counterButton: {
    paddingHorizontal: 5,
  },
  counterButtonText: {
    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "bold",
    color: COLORS.primary, // Antes: "#E76F41"
  },
  counterValue: {
    fontSize: FONTS.small, // Antes: 14
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
    paddingHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.primary, // Antes: "#E76F41"
    width: 65,
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: COLORS.primary, // Antes: "#E76F41"
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // --- AGREGÁ ESTO ACÁ ABAJO ---
  cardContainerWithDelete: {
    marginRight: 0, // Ajuste armónico para que se pegue al botón como en tu Figma
  },
});