import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import Header from '../../components/Header/Header';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { useCart } from '../../components/CartContext';
import { styles } from './favoritos.styles';
import { useTheme } from '../../components/ThemeContext';
import { COLORS } from '../../constants/colors';

export default function FavoritosScreen() {
  const { favoriteItems, toggleFavorite } = useCart();
  const { isDarkMode, colors } = useTheme();

  const favoritosConEstado = useMemo(
    () => favoriteItems.map((item) => ({ ...item, fav: true })),
    [favoriteItems]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Favoritos</Text>
        {favoriteItems.length === 0 ? (
          <View style={[
            styles.emptyBox, 
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border, 
              borderWidth: isDarkMode ? 1 : 0 
            }
          ]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay favoritos aún</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Toca el corazón en una card para agregar productos a tus favoritos.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoritosConEstado}
            renderItem={({ item }) => (
              <ProductoCard item={item} onToggleFavorite={toggleFavorite} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
