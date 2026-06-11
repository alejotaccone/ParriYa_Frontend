import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
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
    marginTop: -50,
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  inputWrapper: {
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
    fontFamily: FONTS.family.semiBold,

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
    fontFamily: FONTS.family.semiBold,

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
    fontFamily: FONTS.family.bold,

    color: COLORS.primary,
    fontSize: FONTS.bodyLarge, // ANTES: 16
    fontWeight: "bold",
  },
  dropdownContainer: {
    position: "absolute",
    top: 85,
    right: 20,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    width: 220,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    minHeight: 48,
  },
  dropdownRowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    minHeight: 48,
  },
  dropdownText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: FONTS.body,
    color: COLORS.textMain,
    fontWeight: "600",
  },
});