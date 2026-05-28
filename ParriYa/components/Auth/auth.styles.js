import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../constants/theme";

export const styles = StyleSheet.create({
  // --- COMPARTIDO: PANTALLAS DE CONTRASEÑA ---
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark, // El fondo oscuro que se ve abajo
  },
  headerBackground: {
    backgroundColor: "#B84521", // Mismo tono que usaste en el perfil
    height: 280,
    paddingTop: 50,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  backButtonHeader: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  lockIconBackground: {
    opacity: 0.1, // Para que el candado quede de marca de agua
    marginTop: 20,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -80,
    paddingTop: 40,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  inputWrapper: {
    marginBottom: 25,
    position: "relative",
    paddingTop: 8,
  },
  inputLabel: {
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
    paddingVertical: 15,
  },
  textInput: {
    fontSize: FONTS.body,
    fontWeight: "600",
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  forgotText: {
    fontSize: FONTS.body,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 25,
    right: 25,
  },
  confirmButtonText: {
    color: COLORS.backgroundLight,
    fontSize: FONTS.h4,
    fontWeight: "bold",
  },

  // --- COMPARTIDO: PANTALLA DE VERIFICACIÓN ---
  verificationContainer: {
    flex: 1,
    backgroundColor: '#D1D1D1', // Gris clarito de fondo
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: COLORS.backgroundLight,
    width: "100%",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonModal: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
  },
  boldEmail: {
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  codeBox: {
    width: 40,
    height: 55,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    textAlign: "center",
    fontSize: FONTS.h3,
    fontWeight: "bold",
    color: COLORS.primary,
    backgroundColor: "#FEF4F1", // Fondito naranja ultra claro
  },
  verifyButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: COLORS.backgroundLight,
    fontSize: FONTS.bodyLarge,
    fontWeight: "bold",
  },
});