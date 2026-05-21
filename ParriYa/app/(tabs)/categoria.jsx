import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import Header from '../../components/Header/Header';
import FiltrosCategoria from '../../components/FiltrosCategoria/FiltrosCategoria'; // Importamos el nuevo componente
import ProductoCard from '../../components/ProductoCard/ProductoCard'; // Importamos el nuevo componente
import { styles } from '../../components/Categoria/categoria.styles'; // Importamos los estilos para esta pantalla

const FILTROS = ['Todo', 'Carnes', 'Sandwiches', 'Pastas', 'Guarniciones'];

const PRODUCTOS_DATA = [
  { id: '1', nombre: 'Lomo', desc: 'A la parrilla', fav: true, image: require('../../assets/images/prod_lomo.png') },
  { id: '2', nombre: 'Chorizo', desc: 'Puro cerdo', fav: false, image: require('../../assets/images/prod_lomo.png') },
  { id: '3', nombre: 'Ribs de cerdo', desc: 'A la barbacoa', fav: false, image: require('../../assets/images/prod_asado.png') },
  { id: '4', nombre: 'Pollo entero', desc: 'Con papas fritas', fav: true, image: require('../../assets/images/prod_asado.png') },
];

export default function CategoriaScreen() {
  const { categoriaSeleccionada } = useLocalSearchParams();
  const [filtroActivo, setFiltroActivo] = useState(categoriaSeleccionada || 'Todo');

  return (
    <View style={styles.container}>
      <Header />

      {/* Le pasamos las responsabilidades (props) al componente de Filtros */}
      <FiltrosCategoria 
        filtros={FILTROS} 
        filtroActivo={filtroActivo} 
        setFiltroActivo={setFiltroActivo} 
      />

      <FlatList
        data={PRODUCTOS_DATA}
        // Usamos el componente de Tarjeta para cada elemento
        renderItem={({ item }) => <ProductoCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}