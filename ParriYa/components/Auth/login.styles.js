import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  // --- FONDOS ---
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary, // Color base naranja
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#D1D1D1', // Fondo gris de la recuperación
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  
  // --- TARJETAS BLANCAS ---
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
  },
  
  // --- TEXTOS E ICONOS ---
  title: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h2,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 25,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.xSmall,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 18,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 5,
    zIndex: 10,
  },

  // --- INPUTS ---
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
    paddingTop: 8,
  },
  inputLabel: {
    fontFamily: FONTS.family.medium,

    position: "absolute",
    top: 0,
    left: 15,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 5,
    fontSize: FONTS.xSmall,
    color: COLORS.textMuted,
    zIndex: 10,
    fontWeight: "500",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
  },
  textInput: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.textMain,
  },

  // --- BOTONES ---
  mainButton: {
    backgroundColor: COLORS.secondary, // Marrón oscuro
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  mainButtonText: {
    fontFamily: FONTS.family.bold,

    color: COLORS.backgroundLight,
    fontSize: FONTS.bodyLarge,
    fontWeight: "bold",
  },
  
  // --- ENLACES ---
  linkText: {
    fontFamily: FONTS.family.medium,

    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: "500",
    marginTop: 20,
  },
  footerText: {
    fontFamily: FONTS.family.regular,

    color: COLORS.textMuted,
    fontSize: FONTS.small,
    marginTop: 15,
  },
  footerTextBold: {
    fontFamily: FONTS.family.bold,

    color: COLORS.primary,
    fontWeight: "bold",
  },
});