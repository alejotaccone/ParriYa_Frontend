import { StyleSheet } from 'react-native';
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight, // Antes: '#FFFFFF'
  },
  // Cabecera calcada de tus otras pantallas
  header: {
    backgroundColor: COLORS.primary, // Antes: '#E76F41'
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
    fontSize: FONTS.h3, // Antes: 22
    fontWeight: 'bold',
    color: COLORS.backgroundLight, // Antes: 'white'
    textAlign: 'center',
    marginRight: 35, // Centrado perfecto compensando la flecha
  },
  // Píldora gris superior
  recientesPill: {
    backgroundColor: COLORS.backgroundGray, // Antes: '#F5F5F5'
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  recientesText: {
    fontSize: FONTS.body, // Antes: 15
    color: COLORS.textMuted, // Antes: '#8E8E93'
  },
  recientesBold: {
    fontWeight: 'bold',
    color: COLORS.textMain, // Antes: '#333333'
  },
  // Contenedor de la lista
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    textAlign: 'center',
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
    fontSize: FONTS.small, // Antes: 13
    color: COLORS.textMuted, // Antes: '#8E8E93'
    fontWeight: '500',
  },
  montoLabel: {
    fontSize: FONTS.small, // Antes: 13
    color: COLORS.textMuted, // Antes: '#8E8E93'
    fontWeight: '500',
  },
  // Tarjeta del pedido individual
  pedidoCard: {
    backgroundColor: COLORS.backgroundGray, // Antes: '#F5F5F5'
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
    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: 'bold',
    color: COLORS.textMain, // Antes: '#333333'
    marginBottom: 4,
  },
  productosText: {
    fontSize: FONTS.small, // Antes: 13
    color: COLORS.textMuted, // Antes: '#8E8E93'
  },
  totalText: {
    fontSize: FONTS.h4, // Antes: 18
    fontWeight: 'bold',
    color: COLORS.textMain, // Antes: '#333333'
  },
});