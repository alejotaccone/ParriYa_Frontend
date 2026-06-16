import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ProductoCard from "../ProductoCard/ProductoCard";
import { styles } from "./MasVendidos.styles";
import api, { resolveProductImg } from "../../services/api";
import { useTheme } from "../ThemeContext";
import { COLORS } from "../../constants/colors";

const MasVendidos = () => {
  const router = useRouter();
  const [productosList, setProductosList] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchProductosDestacados = async () => {
      try {
        const response = await api.get("/productos");
        if (response.data && response.data.length > 0) {
          // Filtrar productos disponibles y tomar los primeros 5
          const disponibles = response.data.filter(
            (p) => p.estado === "disponible" || p.estado === true,
          );
          const sliceSize = disponibles.length > 5 ? 5 : disponibles.length;
          const mapped = disponibles.slice(0, sliceSize).map((p) => ({
            id: String(p.id),
            nombre: p.nombre,
            desc: p.descripcion,
            image: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
            precio: p.precio,
            descripcion: p.descripcion,
          }));
          setProductosList(mapped);
        } else {
          setProductosList([]);
        }
      } catch (error) {
        console.warn(
          "Error al buscar productos para MasVendidos:",
          error.message,
        );
        setProductosList([]);
      }
    };

    fetchProductosDestacados();
  }, []);

  const handleVerTodos = () => {
    router.push({
      pathname: "/(tabs)/categoria",
      params: { categoriaSeleccionada: "Todo" },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          PRODUCTOS DESTACADOS
        </Text>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleVerTodos}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productosList}
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
