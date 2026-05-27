import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Ahora el fondo completo es blanco
  },
  scrollContent: {
    paddingTop: 60, // Da espacio para el status bar del celular
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 30, // Separación entre la flecha y la palabra "Resumen"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B2610', // Mismo marrón de tus títulos
    marginBottom: 15,
  },
  // Resumen
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resumenText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  resumenRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  resumenQty: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 10,
  },
  resumenPrice: {
    fontSize: 15,
    color: '#8E8E93',
  },
  // Métodos de Pago
  paymentMethodEfectivo: {
    backgroundColor: '#3D8C1A', 
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentMethodTarjeta: {
    backgroundColor: '#009EE3', 
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  paymentTextBold: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  paymentSubtext: {
    color: 'white',
    fontSize: 13,
    marginLeft: 15,
    marginTop: 2,
  },
  cardIconWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 2,
  },
  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkboxText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 10,
  },
  // Sugerencias Extras
  suggestionsContainer: {
    flexDirection: 'row',
    marginBottom: 20, 
  },
  suggestionCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  suggestionImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  suggestionName: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  // Footer reestructurado
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footerTotal: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
  },
  currencySymbol: {
    color: '#E76F41',
    fontSize: 22,
  },
  payButton: {
    backgroundColor: '#E76F41',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});