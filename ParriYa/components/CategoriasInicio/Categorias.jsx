import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIAS } from '../../constants/mocks';
import { styles } from './Categorias.styles';

const CATEGORIAS_DATA = CATEGORIAS.map(c => ({
  id: c.id,
  nombre: c.nombre,
  image: c.img_url,
}));

const Categorias = () => {
  const router = useRouter(); 

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/categoria", 
          params: { categoriaSeleccionada: item.nombre } 
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