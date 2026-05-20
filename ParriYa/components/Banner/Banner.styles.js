import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C84B22', // Un tono naranja más oscuro/rojizo para que resalte del fondo
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    position: 'relative', // Nos permite acomodar las flechas y elementos internos
    overflow: 'hidden', // Corta las imágenes si se salen del borde redondeado
  },
  titleSection: {
    fontSize: 14,
    color: '#FAD3C3', // Naranja clarito para el copete
    fontWeight: '600',
    marginBottom: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  promoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 28,
  },
  highlightText: {
    color: '#FFE2B7', // Color amarillento para resaltar el "20% OFF"
  },
  imageContainer: {
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  // Estilos para las flechitas de los costados (carrusel)
  arrowLeft: {
    position: 'absolute',
    left: -10,
    top: '55%',
    backgroundColor: 'white',
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
    right: -10,
    top: '55%',
    backgroundColor: 'white',
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
  // Los puntitos indicadores de abajo (Paginación)
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFE2B7', // El puntito amarillo activo
    width: 12, // Un poquito más largo como en el diseño
  },
});