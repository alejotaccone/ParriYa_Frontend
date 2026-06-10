import { StyleSheet } from 'react-native';
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark, // Antes: '#C84B22'
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    position: 'relative', 
    overflow: 'hidden', 
  },
  titleSection: {
    fontFamily: FONTS.family.semiBold,

    fontSize: FONTS.small, // Antes: 14
    color: COLORS.primaryLight, // Antes: '#FAD3C3'
    fontWeight: '600',
    marginBottom: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  textContainer: {
    flex: 2,
    paddingRight: 10,
  },
  promoText: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h3, // Antes: 22
    fontWeight: 'bold',
    color: COLORS.backgroundLight, // Antes: 'white'
    lineHeight: 28,
  },
  highlightText: {
    color: COLORS.highlight, // Antes: '#FFE2B7'
  },
  imageContainer: {
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fijo por la transparencia
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.highlight, // Antes: '#FFE2B7'
    width: 12, 
  },
});