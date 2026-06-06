import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  button: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    color: COLORS.textMain,
  },
});
