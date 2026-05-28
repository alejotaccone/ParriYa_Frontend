import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "bold",
    color: COLORS.textMuted, // Antes: "#8E8E93"
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20,
  },
});