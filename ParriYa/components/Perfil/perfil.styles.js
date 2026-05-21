import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Un fondo bien oscuro para que resalte la tarjeta blanca
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    backgroundColor: "#B84521", // Un naranja oscuro simulando tu fondo
    height: 260,
    paddingTop: 50,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  headerIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarIcon: {
    marginTop: 10,
  },
  // La tarjeta blanca que se superpone hacia arriba
  contentCard: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: -50, // El margen negativo hace el efecto de subir pisando el color
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 40,
    marginBottom: 20, // Espacio extra para que no choque con la barra de navegación inferior
  },
  // Contenedores para lograr la etiqueta flotante (Floating Label)
  inputWrapper: {
    marginBottom: 20,
    position: "relative",
    paddingTop: 8, // Da aire para que la etiqueta flote cómoda
  },
  inputLabel: {
    position: "absolute",
    top: 0,
    left: 15,
    backgroundColor: "white",
    paddingHorizontal: 5,
    fontSize: 12,
    color: "#8E8E93",
    zIndex: 10,
    fontWeight: "500",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  textInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuRowText: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#E76F41",
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: 200,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#E76F41",
    fontSize: 16,
    fontWeight: "bold",
  },
});
