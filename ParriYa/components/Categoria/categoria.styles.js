import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray, // Antes: '#F5F5F5'
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});