import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 30,
  },
  emptyBox: {
    flex: 1,
    marginTop: 40,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyTitle: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
