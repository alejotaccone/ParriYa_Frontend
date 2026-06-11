import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './FiltrosCategoria.styles';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../../constants/colors';

const FiltrosCategoria = ({ filtros, filtroActivo, setFiltroActivo }) => {
  const { colors, isDarkMode } = useTheme();
  
  const renderFiltro = ({ item }) => {
    const isActive = filtroActivo === item;
    return (
      <TouchableOpacity 
        style={[
          styles.chip, 
          isActive && styles.chipActive,
          {
            backgroundColor: isActive 
              ? COLORS.secondary 
              : colors.card,
            borderColor: isDarkMode && !isActive ? colors.border : "transparent",
            borderWidth: isDarkMode && !isActive ? 1 : 0,
          }
        ]}
        onPress={() => setFiltroActivo(item)}
      >
        <Text style={[
          styles.chipText, 
          isActive && styles.chipTextActive,
          {
            color: isActive 
              ? COLORS.backgroundLight 
              : (isDarkMode ? "#ffffff" : COLORS.textMain)
          }
        ]}>
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