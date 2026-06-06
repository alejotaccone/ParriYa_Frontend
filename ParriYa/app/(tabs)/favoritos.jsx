import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import Header from '../../components/Header/Header';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { useCart } from '../../components/CartContext';
import { styles } from './favoritos.styles';

export default function FavoritosScreen() {
  const { favoriteItems, toggleFavorite } = useCart();

  const favoritosConEstado = useMemo(
    () => favoriteItems.map((item) => ({ ...item, fav: true })),
    [favoriteItems]
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Favoritos</Text>
        {favoriteItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No hay favoritos aún</Text>
            <Text style={styles.emptyText}>
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

