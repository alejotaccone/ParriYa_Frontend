import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 30, // Margen inferior para que no quede pegado al final de la pantalla
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  listContainer: {
    paddingRight: 20,
  },
  cardContainer: {
    width: 160, // Ancho fijo para cada tarjeta
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginRight: 15, // Espacio entre tarjetas
    alignItems: 'center',
    justifyContent: 'space-between',
    // Sombras (mismo efecto de relieve que las categorías)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginTop: 5,
  },
});