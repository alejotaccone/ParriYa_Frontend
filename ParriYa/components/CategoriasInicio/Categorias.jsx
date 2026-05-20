import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './Categorias.styles';

// Datos de las categorías basados en el diseño de la imagen
const CATEGORIAS_DATA = [
  { id: '1', nombre: 'Carnes', image: require('../../assets/images/cat_carnes.png') },
  { id: '2', nombre: 'Sandwiches', image: require('../../assets/images/cat_sandwiches.png') },
  { id: '3', nombre: 'Pastas', image: require('../../assets/images/cat_pastas.png') },
  { id: '4', nombre: 'Guarniciones', image: require('../../assets/images/cat_guarniciones.png') },
  { id: '5', nombre: 'Bebidas', image: require('../../assets/images/cat_carnes.png') }, // Puedes repetir la imagen temporalmente para probar
];

const Categorias = () => {
  // 2. Inicializamos el enrutador
  const router = useRouter(); 

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={0.7}
      // 3. Agregamos la acción de presionar el botón
      onPress={() => {
        router.push({
          pathname: "/categoria", // Ruta a la pantalla nueva
          params: { categoriaSeleccionada: item.nombre } // Le pasamos cuál tocó
        });
      }}
    >
      <View style={styles.circle}>
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>
      <Text style={styles.itemText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>CATEGORIAS</Text>
      
      <FlatList
        data={CATEGORIAS_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Categorias;