import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    backgroundColor: "#B84521", // Color específico de esta cabecera
    height: 260,
    paddingTop: 50,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  headerIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarIcon: {
    marginTop: 10,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -50,
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 40,
    marginBottom: 20, 
  },
  inputWrapper: {
    marginBottom: 20,
    position: "relative",
    paddingTop: 8, 
  },
  inputLabel: {
    position: "absolute",
    top: 0,
    left: 15,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 5,
    fontSize: FONTS.xSmall, // ANTES: 12
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
    backgroundColor: COLORS.backgroundLight,
  },
  textInput: {
    fontSize: FONTS.body, // ANTES: 15
    fontWeight: "600",
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 15,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuRowText: {
    fontSize: FONTS.body, // ANTES: 15
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: 200,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.bodyLarge, // ANTES: 16
    fontWeight: "bold",
  },
});