import React from "react";
import { View, Text, FlatList } from "react-native";
import ProductoCard from "../ProductoCard/ProductoCard"; // <-- Importamos el componente unificado
import { styles } from "./MasVendidos.styles";

const PRODUCTOS_DATA = [
  {
    id: "1",
    nombre: "Lomo a la parrilla",
    desc: "A la parrilla",
    image: require("../../assets/images/prod_lomo.png"),
  },
  {
    id: "2",
    nombre: "Tira de asado",
    desc: "Tira premium",
    image: require("../../assets/images/prod_asado.png"),
  },
  {
    id: "3",
    nombre: "Papas fritas",
    desc: "Bastón crocantes",
    image: require("../../assets/images/prod_papasfritas.png"),
  },
  {
    id: "4",
    nombre: "Vacío al plato",
    desc: "Al horno de barro",
    image: require("../../assets/images/prod_vacio.png"),
  },
  {
    id: "5",
    nombre: "Sandwich de vacio",
    desc: "Con chimichurri",
    image: require("../../assets/images/prod_sandwich.png"),
  },
];

const MasVendidos = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MAS VENDIDOS</Text>

      <FlatList
        data={PRODUCTOS_DATA}
        // Usamos ProductoCard configurado para la Home 👇
        renderItem={({ item }) => (
          <ProductoCard
            item={item}
            mostrarFavorito={false}
            esFormatoHome={true}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MasVendidos;
