import { StyleSheet } from 'react-native';
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight, // Antes: '#FFFFFF'
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 30, 
  },
  sectionTitle: {
    fontSize: FONTS.h4, // Antes: 18
    fontWeight: 'bold',
    color: COLORS.secondary, // Antes: '#4B2610'
    marginBottom: 15,
  },
  // Resumen
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resumenText: {
    fontSize: FONTS.body, // Antes: 15
    color: COLORS.textMuted, // Antes: '#8E8E93'
  },
  resumenRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  resumenQty: {
    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textMuted, // Antes: '#8E8E93'
    marginRight: 10,
  },
  resumenPrice: {
    fontSize: FONTS.body, // Antes: 15
    color: COLORS.textMuted, // Antes: '#8E8E93'
  },
  // Métodos de Pago
  paymentMethodEfectivo: {
    backgroundColor: COLORS.efectivo, // Antes: '#3D8C1A'
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentMethodTarjeta: {
    backgroundColor: COLORS.mercadoPago, // Antes: '#009EE3'
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
    color: COLORS.backgroundLight, // Antes: 'white'
    fontSize: FONTS.bodyLarge, // Antes: 16
    fontWeight: '500',
    marginLeft: 15,
  },
  paymentTextBold: {
    color: COLORS.backgroundLight, // Antes: 'white'
    fontSize: FONTS.body, // Antes: 15
    fontWeight: 'bold',
    marginLeft: 15,
  },
  paymentSubtext: {
    color: COLORS.backgroundLight, // Antes: 'white'
    fontSize: FONTS.small, // Antes: 13 (unificado a 14)
    marginLeft: 15,
    marginTop: 2,
  },
  cardIconWrapper: {
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
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
    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textMuted, // Antes: '#8E8E93'
    marginLeft: 10,
  },
  // Sugerencias Extras
  suggestionsContainer: {
    flexDirection: 'row',
    marginBottom: 20, 
  },
  suggestionCard: {
    width: 120,
    backgroundColor: COLORS.backgroundLight, // Antes: '#FFFFFF'
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight, // Antes: '#F0F0F0'
  },
  suggestionImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  suggestionName: {
    fontSize: FONTS.xSmall, // Antes: 12
    color: COLORS.textMuted, // Antes: '#8E8E93'
    textAlign: 'center',
  },
  // Footer reestructurado
  footer: {
    backgroundColor: COLORS.backgroundLight, // Antes: 'white'
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight, // Antes: '#F0F0F0'
  },
  footerLabel: {
    fontSize: FONTS.small, // Antes: 14
    color: COLORS.textMuted, // Antes: '#8E8E93'
  },
  footerTotal: {
    fontSize: FONTS.h2, // Antes: 26
    fontWeight: 'bold',
    color: COLORS.textMain, // Antes: '#111111'
  },
  currencySymbol: {
    color: COLORS.primary, // Antes: '#E76F41'
    fontSize: FONTS.h3, // Antes: 22
  },
  payButton: {
    backgroundColor: COLORS.primary, // Antes: '#E76F41'
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  payButtonText: {
    color: COLORS.backgroundLight, // Antes: 'white'
    fontSize: FONTS.h4, // Antes: 18
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: COLORS.backgroundLight,
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
  },
});