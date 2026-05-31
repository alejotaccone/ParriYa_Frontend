import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import Header from '../../components/Header/Header';
import FiltrosCategoria from '../../components/FiltrosCategoria/FiltrosCategoria';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { CATEGORIAS, PRODUCTOS } from '../../constants/mocks';
import { styles } from '../../components/Categoria/categoria.styles';

const FILTROS = ['Todo', ...CATEGORIAS.map(c => c.nombre)];

const PRODUCTOS_DATA = PRODUCTOS.map(p => ({
  id: p.id,
  nombre: p.nombre,
  desc: p.descripcion,
  fav: false,
  image: p.img_url,
  categoria_id: p.categoria_id,
  precio: p.precio,
}));

export default function CategoriaScreen() {
  const { categoriaSeleccionada } = useLocalSearchParams();
  const [filtroActivo, setFiltroActivo] = useState(categoriaSeleccionada || 'Todo');

  return (
    <View style={styles.container}>
      <Header />

      <FiltrosCategoria 
        filtros={FILTROS} 
        filtroActivo={filtroActivo} 
        setFiltroActivo={setFiltroActivo} 
      />

      <FlatList
        data={PRODUCTOS_DATA}
        renderItem={({ item }) => <ProductoCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}