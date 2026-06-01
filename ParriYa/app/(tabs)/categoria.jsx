import React, { useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header/Header';
import FiltrosCategoria from '../../components/FiltrosCategoria/FiltrosCategoria';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { CATEGORIAS, PRODUCTOS } from '../../constants/mocks';
import { useCart } from '../../components/CartContext';
import { styles } from '../../components/Categoria/categoria.styles';

const FILTROS = ['Todo', ...CATEGORIAS.map((c) => c.nombre)];

export default function CategoriaScreen() {
  const { categoriaSeleccionada } = useLocalSearchParams();
  const [filtroActivo, setFiltroActivo] = useState(categoriaSeleccionada || 'Todo');
  const { favoriteItems, toggleFavorite, isFavorite } = useCart();

  const PRODUCTOS_DATA = useMemo(
    () =>
      PRODUCTOS.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        desc: p.descripcion,
        fav: isFavorite(p.id),
        image: p.img_url,
        categoria_id: p.categoria_id,
        precio: p.precio,
      })),
    [favoriteItems]
  );

  const productosFiltrados = useMemo(
    () =>
      PRODUCTOS_DATA.filter(
        (item) =>
          filtroActivo === 'Todo' ||
          item.categoria_id ===
            CATEGORIAS.find((cat) => cat.nombre === filtroActivo)?.id
      ),
    [PRODUCTOS_DATA, filtroActivo]
  );

  return (
    <View style={styles.container}>
      <Header />

      <FiltrosCategoria
        filtros={FILTROS}
        filtroActivo={filtroActivo}
        setFiltroActivo={setFiltroActivo}
      />

      <FlatList
        data={productosFiltrados}
        renderItem={({ item }) => (
          <ProductoCard item={item} onToggleFavorite={toggleFavorite} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}