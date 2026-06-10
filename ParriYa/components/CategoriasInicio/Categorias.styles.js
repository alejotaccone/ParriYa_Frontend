import { StyleSheet } from 'react-native';
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: 'bold',
    color: COLORS.textMuted, // Antes: '#8E8E93'
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20, 
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 20, 
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5, 
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, 
    marginBottom: 8,
    overflow: 'hidden', 
  },
  image: {
    width: '70%',
    height: '70%',
  },
  itemText: {
    fontFamily: FONTS.family.medium,

    fontSize: FONTS.small, // Antes: 14
    fontWeight: '500',
    color: COLORS.textMain, // Antes: '#333333'
  },
});