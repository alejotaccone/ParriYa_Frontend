import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ProductoCard from "../ProductoCard/ProductoCard";
import { PRODUCTOS } from "../../constants/mocks";
import { styles } from "./MasVendidos.styles";

const PRODUCTOS_DATA = PRODUCTOS.slice(0, 5).map(p => ({
  id: p.id,
  nombre: p.nombre,
  desc: p.descripcion,
  image: p.img_url,
  precio: p.precio,
}));

const MasVendidos = () => {
  const router = useRouter();

  const handleVerTodos = () => {
    router.push({
      pathname: '/(tabs)/categoria',
      params: { categoriaSeleccionada: 'Todo' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>PRODUCTOS DESTACADOS</Text>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleVerTodos}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

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
