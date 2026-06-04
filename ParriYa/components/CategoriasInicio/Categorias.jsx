import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIAS } from '../../constants/mocks';
import { styles } from './Categorias.styles';
import api, { resolveCategoryImg } from '../../services/api';

const Categorias = () => {
  const router = useRouter(); 
  const [categoriasList, setCategoriasList] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        if (response.data && response.data.length > 0) {
          const mapped = response.data.map(c => ({
            id: String(c.id),
            nombre: c.nombre,
            image: resolveCategoryImg(c.nombre, c.imgUrl || c.img_url)
          }));
          setCategoriasList(mapped);
        } else {
          setCategoriasList([]);
        }
      } catch (error) {
        console.warn('Error al buscar categorías del backend:', error.message);
        setCategoriasList([]);
      }
    };

    fetchCategorias();
  }, []);

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
        data={categoriasList}
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