import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ContadorCantidad from "../components/Contador/ContadorCantidad";
import { styles } from "../components/Detalle/detalle.styles";

const DETALLE_PRODUCTOS = {
  1: {
    id: "1",
    nombre: "Lomo vacuno a la parrilla",
    precio: 20000,
    image: require("../assets/images/prod_lomo.png"),
    descripcionLarga:
      "Corte premium de lomo, tierno y jugoso, cocinado a la parrilla en su punto justo para resaltar todo su sabor natural. Sellado a fuego intenso para lograr una textura dorada por fuera y suave por dentro, acompañado con un delicado toque de sal y especias.",
  },
};

export default function DetalleScreen() {
  const router = useRouter();
  const { idProducto } = useLocalSearchParams();
  const producto = DETALLE_PRODUCTOS[idProducto] || DETALLE_PRODUCTOS["1"];

  const [cantidad, setCantidad] = useState(1);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("Jugoso");
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para abrir/cerrar la lista

  const puntosDisponibles = ["Jugoso", "A punto", "Cocido"];

  const precioTotal = producto.precio * cantidad;

  const seleccionarPunto = (punto) => {
    setPuntoSeleccionado(punto);
    setMenuAbierto(false); // Cierra la lista después de elegir
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Imagen Principal y Botón Volver */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={producto.image}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Detalles del Producto */}
        <View style={styles.infoContainer}>
          <Text style={styles.priceValue}>
            ${producto.precio.toLocaleString("es-AR")}
          </Text>
          <Text style={styles.title}>{producto.nombre}</Text>
          <Text style={styles.descriptionText}>
            {producto.descripcionLarga}
          </Text>

          {/* SELECTORES INFERIORES */}
          <View style={styles.selectorContainer}>
            {/* Dropdown Desplegable Real */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.selectorLabel}>
                Elija el punto de la carne
              </Text>

              {/* Botón Principal (Cambia de estilo según si está abierto o cerrado) */}
              <TouchableOpacity
                style={[
                  styles.dropdownSimulado,
                  menuAbierto && styles.dropdownAbierto,
                ]}
                activeOpacity={0.9}
                onPress={() => setMenuAbierto(!menuAbierto)}
              >
                <Text style={styles.dropdownText}>
                  {menuAbierto ? "Seleccione una opcion" : puntoSeleccionado}
                </Text>
                <Ionicons
                  name={menuAbierto ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="white"
                />
              </TouchableOpacity>

              {/* LISTA DESPLEGABLE (Solo aparece si menuAbierto es true) */}
              {menuAbierto && (
                <View style={styles.dropdownOptionsContainer}>
                  {puntosDisponibles.map((punto, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionButton}
                      onPress={() => seleccionarPunto(punto)}
                    >
                      <Text style={styles.optionText}>{punto}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Contador de Cantidad */}
            <View style={styles.cantidadWrapper}>
              <Text style={styles.selectorLabel}>Cantidad</Text>
              <ContadorCantidad
                cantidad={cantidad}
                onIncrement={() => setCantidad(cantidad + 1)}
                onDecrement={() => cantidad > 1 && setCantidad(cantidad - 1)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón Añadir al Carrito Fijo Abajo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>AÑADIR AL CARRITO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
