import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
  },
  titleText: {
    fontSize: FONTS.h1, // <-- ANTES: 32
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  addressText: {
    fontSize: FONTS.bodyLarge, // <-- ANTES: 16
    color: COLORS.secondary,
    marginTop: 4,
  },
  logoAndCartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartHeaderButton: {
    marginRight: 15, 
    padding: 5,
  },
  grillLogo: {
    width: 60,
    height: 60,
  },
  bottomRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: COLORS.backgroundLight,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.bodyLarge, // <-- ANTES: 16
    color: COLORS.textMain,
  },
  favoritesButton: {
    backgroundColor: COLORS.backgroundLight,
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});