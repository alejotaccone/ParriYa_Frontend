import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { SIZES } from "../../constants/sizes";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundLight, // Antes: "white"[cite: 21]
    borderRadius: 15, //[cite: 21]
    padding: 15, //[cite: 21]
    margin: 5, //[cite: 21]
    shadowColor: "#000", //[cite: 21]
    shadowOffset: { width: 0, height: 2 }, //[cite: 21]
    shadowOpacity: 0.1, //[cite: 21]
    shadowRadius: 4, //[cite: 21]
    elevation: 3, //[cite: 21]
    position: 'relative',
  },
  // Estilo por defecto para la grilla (ocupa el espacio disponible)
  cardGrid: {
    flex: 1, //[cite: 21]
  },
  // Estilo para la Home (ancho fijo para el carrusel horizontal)
  cardHome: {
    width: 160, //[cite: 21]
    marginRight: 15, // Espacio entre tarjetas en el carrusel[cite: 21]
  },
  imageContainer: {
    height: 100, //[cite: 21]
    alignItems: "center", //[cite: 21]
    justifyContent: "center", //[cite: 21]
    marginBottom: 10, //[cite: 21]
  },
  image: {
    width: "100%", //[cite: 21]
    height: "100%", //[cite: 21]
  },
  title: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge, // Antes: 16[cite: 21]
    fontWeight: "bold", //[cite: 21]
    color: COLORS.textMain, // Antes: "#333"[cite: 21]
  },
  subtitle: {
    fontFamily: FONTS.family.regular,

    fontSize: FONTS.xSmall, // Antes: 12[cite: 21]
    color: COLORS.textSecondary, // Antes: "#666" (Unificado al gris de las descripciones)[cite: 21]
    marginTop: 2, //[cite: 21]
    marginBottom: 10, //[cite: 21]
  },
  heartIcon: {
    alignSelf: "flex-end", //[cite: 21]
  },
  heartOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontFamily: FONTS.family.bold,

    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 230,
    padding: 18,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: FONTS.family.bold,

    marginTop: 12,
    fontSize: FONTS.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
  },
});