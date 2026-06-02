import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantText: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.dropdownDark, // El verde oscuro de la paleta
    marginBottom: 6,
  },
  estimatedTimeText: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.backgroundLight,
    marginBottom: 15,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: -3, // Compensa el margen horizontal de los segmentos
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeSegment: {
    backgroundColor: '#0DF5E3', // Color cian vibrante de la imagen
  },
  inactiveSegment: {
    backgroundColor: '#FFFFFF', // Blanco puro
  },
  descriptionText: {
    fontSize: FONTS.small,
    fontWeight: '500',
    color: COLORS.backgroundLight,
    lineHeight: 18,
  },
});
