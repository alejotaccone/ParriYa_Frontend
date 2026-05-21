import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Cabecera calcada de tus otras pantallas
  header: {
    backgroundColor: '#E76F41',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginRight: 35, // Centrado perfecto compensando la flecha
  },
  // Píldora gris superior
  recientesPill: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  recientesText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  recientesBold: {
    fontWeight: 'bold',
    color: '#333333',
  },
  // Contenedor de la lista
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  itemContainer: {
    marginBottom: 15,
  },
  // Fila de Fecha y "Monto"
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 8,
    marginTop: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  montoLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  // Tarjeta del pedido individual
  pedidoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productosText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
});