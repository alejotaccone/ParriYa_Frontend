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
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: "bold",
    color: COLORS.textMuted, // Antes: "#8E8E93"
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingRight: 20,
  },
});