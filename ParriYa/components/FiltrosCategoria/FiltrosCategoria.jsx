import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './FiltrosCategoria.styles';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../../constants/colors';

const FiltrosCategoria = ({ filtros, filtroActivo, setFiltroActivo }) => {
  const { colors, isDarkMode } = useTheme();
  
  const renderFiltro = ({ item }) => {
    const isActive = filtroActivo === item;
    let textColor = isDarkMode ? "#ffffff" : COLORS.textMain;
    if (isActive) {
      textColor = COLORS.backgroundLight;
    }

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
            color: textColor
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

FiltrosCategoria.propTypes = {
  filtros: PropTypes.arrayOf(PropTypes.string).isRequired,
  filtroActivo: PropTypes.string.isRequired,
  setFiltroActivo: PropTypes.func.isRequired,
};

export default FiltrosCategoria;