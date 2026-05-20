import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { styles } from './MasVendidos.styles';

// Datos cableados iniciales que simulan los productos más populares
const PRODUCTOS_DATA = [
  { id: '1', nombre: 'Lomo a la parrilla', image: require('../../assets/images/prod_lomo.png') },
  { id: '2', nombre: 'Tira de asado', image: require('../../assets/images/prod_asado.png') },
  { id: '3', nombre: 'Papas fritas', image: require('../../assets/images/prod_papasfritas.png') }, // Repetimos para rellenar
  { id: '4', nombre: 'Vacío al plato', image: require('../../assets/images/prod_vacio.png') },
   { id: '5', nombre: 'Sandwich de vacio', image: require('../../assets/images/prod_sandwich.png') },
];

const MasVendidos = () => {
  // Renderizador de cada tarjeta de producto
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.productImage} 
          resizeMode="contain" 
        />
      </View>
      <Text style={styles.productName} numberOfLines={2}>
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MAS VENDIDOS</Text>
      
      <FlatList
        data={PRODUCTOS_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MasVendidos;