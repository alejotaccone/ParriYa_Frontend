import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.backgroundGray, 
  },
  scrollContent: {
    paddingBottom: 30, 
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    
    // Propiedades de sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    
    // Elevación para Android
    elevation: 8,
  },
  whatsappIcon: {
    width: 60,
    height: 60,
  },
});
