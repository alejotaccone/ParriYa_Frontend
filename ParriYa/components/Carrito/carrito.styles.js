import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray, // Antes: "#F5F5F5"
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: COLORS.primary, // Antes: "#E76F41"
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
    fontFamily: FONTS.family.bold,

    flex: 1,
    fontSize: FONTS.h3, // Antes: 22
    fontWeight: "bold",
    color: COLORS.backgroundLight, // Antes: "white"
    textAlign: "center",
    marginRight: 35, 
  },
  // Info de entrega
  deliveryInfo: {
    alignItems: "center",
    marginVertical: 15,
  },
  deliveryMethod: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
  },
  deliveryTime: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.small, // Antes: 13 (unificado a 14)
    color: COLORS.textMuted, // Antes: "#8E8E93"
    marginTop: 2,
  },
  productsList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionsContainer: {
    marginBottom: 25,
  },
  suggestionsTitle: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "600",
    color: COLORS.textMain, // Antes: "#333333"
    textAlign: "center",
    marginBottom: 15,
  },
  suggestionsList: {
    paddingLeft: 20,
  },
  suggestionCard: {
    width: 140,
    backgroundColor: COLORS.backgroundLight, // Antes: "white"
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
    fontFamily: FONTS.family.medium,

    fontSize: FONTS.small, // Antes: 13 (unificado a 14)
    fontWeight: "500",
    color: COLORS.textMain, // Antes: "#333333"
    textAlign: "center",
  },
  
  resumenContainer: {
    backgroundColor: COLORS.backgroundLight, // Antes: "white"
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
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h4, // Antes: 18
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
    marginBottom: 15,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resumenLabel: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textMuted, // Antes: "#8E8E93"
  },
  resumenValue: {
    fontFamily: FONTS.family.medium,

    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textMain, // Antes: "#333333"
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight, // Antes: "#EFEFEF" (Estandarizado a #F0F0F0)
    marginVertical: 15,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtotalLabel: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h4, // Antes: 18
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
  },
  subtotalValue: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h3, // Antes: 22
    fontWeight: "bold",
    color: COLORS.textMain, // Antes: "#333333"
  },
  payButton: {
    backgroundColor: COLORS.primary, // Antes: "#E76F41"
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    fontFamily: FONTS.family.bold,

    color: COLORS.backgroundLight, // Antes: "white"
    fontSize: FONTS.h4, // Antes: 18
    fontWeight: "bold",
  },
});