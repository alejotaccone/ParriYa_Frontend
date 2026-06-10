import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight, // Antes: "#FFFFFF"
  },
  imageContainer: {
    backgroundColor: COLORS.backgroundGray, // Antes: "#F5F5F5"
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: COLORS.backgroundLight,
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: COLORS.backgroundLight,
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
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h2, // Antes: 26
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
  },
  subtitle: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textSecondary, // Antes: "#777777"
    marginBottom: 20,
  },
  descriptionTitle: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.body, // Antes: 15
    color: COLORS.textDescription, // Antes: "#555555"
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight, // Antes: "#EEEEEE"
    backgroundColor: COLORS.backgroundLight, // Antes: "white"
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textSecondary, // Antes: "#777777"
    fontWeight: "600",
  },
  priceValue: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.price, // Antes: 28
    fontWeight: "bold",
    color: COLORS.secondary, // Antes: "#4B2610"
  },
  // Botón Agregar
  addButton: {
    backgroundColor: COLORS.secondary, // Antes: "#4B2610"
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.secondary, // Antes: "#4B2610"
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontFamily: FONTS.family.bold,

    color: COLORS.backgroundLight, // Antes: "white"
    fontSize: FONTS.h4, // Antes: 18
    fontWeight: "bold",
  },
  favoriteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteModalCard: {
    width: 220,
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  favoriteModalText: {
    fontFamily: FONTS.family.semiBold,

    marginTop: 10,
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", 
    marginTop: 25,
    position: "relative", 
    zIndex: 50,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 15,
    zIndex: 100, 
  },
  cantidadWrapper: {
    alignItems: "center",
    zIndex: 10,
  },
  selectorLabel: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.small, // Antes: 14
    fontWeight: "600",
    color: COLORS.textMain, // Antes: "#333333"
    marginBottom: 8,
  },
  dropdownSimulado: {
    backgroundColor: COLORS.dropdownDark, // Antes: "#04332D"
    borderRadius: 25, 
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

  dropdownAbierto: {
    borderWidth: 1,
    borderColor: COLORS.dropdownDark, // Antes: "#04332D"
    backgroundColor: COLORS.dropdownDark, // Antes: "#04332D"
    borderRadius: 20,
  },
  dropdownText: {
    fontFamily: FONTS.family.medium,

    color: COLORS.backgroundLight, // Antes: "white"
    fontSize: FONTS.body, // Antes: 15
    fontWeight: "500",
  },

  dropdownOptionsContainer: {
    backgroundColor: COLORS.dropdownDark, // Antes: "#04332D"
    borderRadius: 20,
    marginTop: 8,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionText: {
    fontFamily: FONTS.family.regular,

    color: COLORS.backgroundLight, // Antes: "white"
    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "400",
  },
});