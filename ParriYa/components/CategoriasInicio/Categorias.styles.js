import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E8E93', // Gris para el título de la sección como en el diseño
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20, // Espacio extra al final del scroll
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 20, // Espacio entre cada círculo
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5, // Hace que el contenedor sea perfectamente redondo
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras para darle el efecto de relieve (Shadow/Elevation)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, 
    marginBottom: 8,
    overflow: 'hidden', // Evita que la imagen se salga del círculo
  },
  image: {
    width: '70%',
    height: '70%',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
});