import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: COLORS.primary, // Fondo naranja del header
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  headerTitle: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.secondary, // Marrón oscuro
  },
  grillLogo: {
    width: 60,
    height: 60,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  linkTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginRight: 4,
  },
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // --- GRIDS DE TABLAS ---
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
    marginBottom: 5,
  },
  tableHeaderCol: {
    fontSize: FONTS.xSmall,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  tableRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tableCol: {
    fontSize: FONTS.body,
    color: COLORS.textMain,
    textAlign: 'center',
  },

  // --- ANCHOS DE COLUMNAS PARA PEDIDOS ---
  orderColNro: {
    flex: 1.2,
  },
  orderColNombre: {
    flex: 2.8,
  },
  orderColEstado: {
    flex: 2.2,
  },
  orderColPrecio: {
    flex: 2.2,
  },

  // --- ANCHOS DE COLUMNAS PARA RESERVAS ---
  reservaColHorario: {
    flex: 1.8,
  },
  reservaColNombre: {
    flex: 3.5,
  },
  reservaColCantidad: {
    flex: 2.2,
  },

  // --- ESTILOS DE TEXTO ESPECÍFICOS ---
  orderNoText: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  clientNameText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  statusText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.primary, // El naranja/rojo del mockup ("Entregado")
    textAlign: 'center',
  },
  priceText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  timeText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  countText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.primary, // El naranja/rojo de la cantidad de personas
    textAlign: 'center',
  },

  // --- FEEDBACK ---
  feedbackItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  feedbackItemNoBorder: {
    paddingVertical: 10,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackClientName: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONTS.small,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginRight: 4,
  },
  feedbackComment: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // --- NAVEGACIÓN INFERIOR ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.secondary, // El marrón oscuro
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // --- DETALLE DE PEDIDOS (BACKOFFICE) ---
  backHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
    zIndex: 10,
  },
  backHeaderTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: '#FFFFFF', // Blanco para el título "Pedidos"
    textAlign: 'center',
  },
  recientesBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  recientesText: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  ultimos7DiasText: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
  },
  orderDetailCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  orderClientName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderQtyLabel: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  orderItemName: {
    fontSize: FONTS.body,
    color: COLORS.textDescription,
  },
  orderItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemQty: {
    fontSize: FONTS.body,
    color: COLORS.textMuted,
    marginRight: 25,
    textAlign: 'right',
  },
  orderItemPrice: {
    fontSize: FONTS.body,
    color: COLORS.textDescription,
    width: 70,
    textAlign: 'right',
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    marginTop: 10,
  },
  orderTotalLabel: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  orderTotalPrice: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  
  // --- BADGES DE ESTADO (SELECTORES DE ADMIN) ---
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  statusBadgeRecibido: {
    backgroundColor: '#E5E5EA', // Gris claro
  },
  statusBadgePreparando: {
    backgroundColor: '#FFE2B7', // Naranja claro
  },
  statusBadgeListo: {
    backgroundColor: '#D2F9F6', // Celeste/Cian claro
  },
  statusBadgeFinalizado: {
    backgroundColor: '#D2F9D2', // Verde claro
  },
  statusBadgeTextRecibido: {
    fontSize: FONTS.xSmall,
    fontWeight: 'bold',
    color: '#555555',
  },
  statusBadgeTextPreparando: {
    fontSize: FONTS.xSmall,
    fontWeight: 'bold',
    color: '#E76F41',
  },
  statusBadgeTextListo: {
    fontSize: FONTS.xSmall,
    fontWeight: 'bold',
    color: '#00A89F',
  },
  statusBadgeTextFinalizado: {
    fontSize: FONTS.xSmall,
    fontWeight: 'bold',
    color: '#3D8C1A',
  },
  
  // --- VENTANA EMERGENTE CUSTOM (MODAL DE ESTADOS) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 25,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalSubtitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  modalItemsList: {
    maxHeight: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  modalItemText: {
    fontSize: FONTS.small,
    color: COLORS.textDescription,
  },
  statusOptionsTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 10,
  },
  statusOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 5,
  },
  statusBtnInactive: {
    borderColor: '#E5E5EA',
    backgroundColor: 'transparent',
  },
  statusBtnActiveRecibido: {
    borderColor: '#8E8E93',
    backgroundColor: '#F2F2F7',
  },
  statusBtnActivePreparando: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFE2B7',
  },
  statusBtnActiveListo: {
    borderColor: '#00A89F',
    backgroundColor: '#D2F9F6',
  },
  statusBtnActiveFinalizado: {
    borderColor: '#3D8C1A',
    backgroundColor: '#D2F9D2',
  },
  statusBtnText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  statusBtnTextActiveRecibido: {
    color: '#555555',
  },
  statusBtnTextActivePreparando: {
    color: '#E76F41',
  },
  statusBtnTextActiveListo: {
    color: '#00A89F',
  },
  statusBtnTextActiveFinalizado: {
    color: '#3D8C1A',
  },
  modalConfirmButton: {
    backgroundColor: COLORS.secondary, // Marrón oscuro
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
  },
  
  // --- DETALLE DE RESERVAS (BACKOFFICE) ---
  calendarScroll: {
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  calendarDayCard: {
    width: 85,
    height: 95,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  calendarDayCardActive: {
    backgroundColor: COLORS.primary, // Naranja destacado
  },
  calendarDayCardInactive: {
    backgroundColor: COLORS.backgroundLight, // Blanco
  },
  calendarDayOfWeekTextActive: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  calendarDayOfWeekTextInactive: {
    fontSize: FONTS.small,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginBottom: 5,
  },
  calendarDayNumberTextActive: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calendarDayNumberTextInactive: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
  },
  summaryDateText: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  summaryStatsText: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
  },
  shiftSection: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  shiftTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: '#777777',
    marginBottom: 10,
  },
  stateTextConfirmada: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.primary, // El naranja/rojo de la confirmación
    textAlign: 'center',
  },
  stateTextCancelada: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#D9534F', // El rojo para reservas canceladas
    textAlign: 'center',
  },
  actionButtonContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  largeOrangeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  largeOrangeButtonText: {
    color: '#FFFFFF',
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
  },
  
  // --- FORMULARIOS DE AGREGAR/EDITAR EN MODALES ---
  addModalInputWrapper: {
    width: '100%',
    marginVertical: 8,
  },
  addModalInputLabel: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  addModalTextInput: {
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FONTS.body,
    color: COLORS.textMain,
  },
  
  // --- CATALOGO DE PRODUCTOS (ABM BACKOFFICE) ---
  categoryScroll: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  categoryFilterCard: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryFilterCardActive: {
    backgroundColor: COLORS.secondary, // Marrón oscuro
  },
  categoryFilterCardInactive: {
    backgroundColor: COLORS.backgroundLight, // Blanco
  },
  categoryFilterTextActive: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryFilterTextInactive: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.textMain,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  productCardImageContainer: {
    width: 75,
    height: 75,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginRight: 15,
  },
  productCardImage: {
    width: '100%',
    height: '100%',
  },
  productCardContent: {
    flex: 1,
  },
  productCardName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  productCardCategory: {
    fontSize: FONTS.xSmall,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  productCardDescription: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  productEditButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.secondary, // Marrón oscuro del mockup
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  
  // --- IMAGEN DOTTED PREVIEW ---
  modalImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#C5C5C9',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  modalImagePreview: {
    width: '100%',
    height: '100%',
  },
  modalImageText: {
    fontSize: FONTS.small,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  modalImagePlaceholderBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  
  // --- DETALLE DE FEEDBACK (BACKOFFICE) ---
  feedbackDetailCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackClientNameText: {
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: '#333333',
  },
  feedbackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackDateText: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    marginRight: 10,
  },
  feedbackOrderText: {
    fontSize: FONTS.small,
    fontWeight: 'bold',
    color: COLORS.primary, // Naranja para el número de pedido
  },
  feedbackCommentText: {
    fontSize: FONTS.body,
    color: COLORS.textDescription,
    lineHeight: 20,
  },
});
