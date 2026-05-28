import { StyleSheet } from 'react-native';
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: COLORS.secondary, // Antes: '#4B2610'
  },
  chipText: {
    fontSize: FONTS.small, // Antes: 14
    fontWeight: '600',
    color: COLORS.textMain, // Antes: '#333333'
  },
  chipTextActive: {
    color: COLORS.backgroundLight, // Antes: 'white'
  },
});