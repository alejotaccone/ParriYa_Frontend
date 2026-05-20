import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ProductoCard.styles';

const ProductoCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.subtitle}>{item.desc}</Text>
      
      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons 
          name={item.fav ? "heart" : "heart-outline"} 
          size={24} 
          color={item.fav ? "red" : "black"} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProductoCard;