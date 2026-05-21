import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    marginRight: 35, 
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  // Elementos de la lista de productos
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemName: {
    fontSize: 15,
    color: '#8E8E93',
    flex: 1,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
  },
  itemQty: {
    fontSize: 15,
    color: '#8E8E93',
  },
  itemPrice: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  // Separador Naranja con puntitos
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E76F41',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E76F41',
  },
  // Fila Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  // Filas de Información General
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  infoValue: {
    fontSize: 15,
    color: '#8E8E93',
  },
});