import React from "react";
import { View, Text, FlatList } from "react-native";
import ProductoCard from "../ProductoCard/ProductoCard";
import { PRODUCTOS } from "../../constants/mocks";
import { styles } from "./MasVendidos.styles";

const PRODUCTOS_DATA = PRODUCTOS.slice(0, 5).map(p => ({
  id: p.id,
  nombre: p.nombre,
  desc: p.descripcion,
  image: p.img_url,
}));

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
