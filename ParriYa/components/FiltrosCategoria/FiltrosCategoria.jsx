import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './FiltrosCategoria.styles';

const FiltrosCategoria = ({ filtros, filtroActivo, setFiltroActivo }) => {
  
  const renderFiltro = ({ item }) => {
    const isActive = filtroActivo === item;
    return (
      <TouchableOpacity 
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => setFiltroActivo(item)}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={filtros}
        renderItem={renderFiltro}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      />
    </View>
  );
};

export default FiltrosCategoria;