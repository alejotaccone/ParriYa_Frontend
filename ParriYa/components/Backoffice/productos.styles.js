import { useMemo } from 'react';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

/**
 * Hook de estilos dinámicos para BackofficeProductos.
 * Centraliza toda la lógica de theme (colors + isDarkMode) que antes
 * vivía como objetos literales inline en el JSX, eliminando los Code Smells
 * de SonarCloud sin romper el comportamiento de los estilos en runtime.
 *
 * Uso:  const dynStyles = useProductosStyles(colors, isDarkMode);
 */
export function useProductosStyles(colors, isDarkMode) {
  return useMemo(() => ({

    // Contenedor raíz
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Filtro de categorías (scroll horizontal) ──────────────────
    catFilterActive: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 15,
      marginHorizontal: 6,
      backgroundColor: COLORS.secondary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    catFilterInactive: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 15,
      marginHorizontal: 6,
      backgroundColor: colors.card,
      borderColor: isDarkMode ? colors.border : 'transparent',
      borderWidth: isDarkMode ? 1 : 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    catFilterTextActive: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.body,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    catFilterTextInactive: {
      fontFamily: FONTS.family.medium,
      fontSize: FONTS.body,
      fontWeight: '500',
      color: colors.text,
    },

    // ── Tarjeta de producto ───────────────────────────────────────
    productCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderColor: isDarkMode ? colors.border : 'transparent',
      borderWidth: isDarkMode ? 1 : 0,
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
      backgroundColor: isDarkMode ? colors.box : '#F5F5F5',
      overflow: 'hidden',
      marginRight: 15,
    },
    productCardName: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.bodyLarge,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    productCardDescription: {
      fontFamily: FONTS.family.regular,
      fontSize: FONTS.small,
      color: colors.textMuted,
      lineHeight: 16,
    },

    // ── Texto vacío ───────────────────────────────────────────────
    emptyText: {
      textAlign: 'center',
      marginVertical: 30,
      color: colors.textMuted,
    },

    // ── Modal ABM ─────────────────────────────────────────────────
    modalCard: {
      backgroundColor: colors.card,
      borderColor: isDarkMode ? colors.border : 'transparent',
      borderWidth: isDarkMode ? 1 : 0,
      borderRadius: 25,
      padding: 25,
      width: '92%',
      maxWidth: 450,
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 10,
    },
    modalTitle: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.h3,
      fontWeight: 'bold',
      color: colors.text,
    },

    // ── Inputs del modal ──────────────────────────────────────────
    inputLabel: {
      fontFamily: FONTS.family.semiBold,
      fontSize: FONTS.small,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 6,
    },
    textInput: {
      fontFamily: FONTS.family.regular,
      borderWidth: 1,
      borderColor: isDarkMode ? colors.border : COLORS.borderMedium,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: FONTS.body,
      color: colors.text,
      backgroundColor: isDarkMode ? colors.box : 'transparent',
    },
    textInputMultiline: {
      height: 80,
      textAlignVertical: 'top',
    },

    // ── Preview de imagen ─────────────────────────────────────────
    modalImageContainer: {
      width: '100%',
      height: 120,
      borderRadius: 15,
      borderWidth: 1.5,
      borderColor: isDarkMode ? colors.border : '#E5E5EA',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 15,
      backgroundColor: isDarkMode ? colors.box : '#F5F5F5',
      overflow: 'hidden',
    },
    modalImagePlaceholderBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 10,
    },
    modalImageText: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.small,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginTop: 8,
    },

    // ── Selector de categorías del modal ──────────────────────────
    catBtnSelected: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 15,
      borderWidth: 2,
      marginHorizontal: 4,
      marginVertical: 0,
      borderColor: COLORS.primary,
      backgroundColor: '#FFE2B7',
    },
    catBtnUnselected: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 15,
      borderWidth: 2,
      marginHorizontal: 4,
      marginVertical: 0,
      borderColor: isDarkMode ? colors.border : '#E5E5EA',
      backgroundColor: 'transparent',
    },
    catBtnTextSelected: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.body,
      fontWeight: 'bold',
      color: '#E76F41',
      marginLeft: 0,
    },
    catBtnTextUnselected: {
      fontFamily: FONTS.family.bold,
      fontSize: FONTS.body,
      fontWeight: 'bold',
      color: isDarkMode ? colors.textMuted : '#8E8E93',
      marginLeft: 0,
    },

  }), [colors, isDarkMode]);
}
