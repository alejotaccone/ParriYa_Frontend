import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '../../components/Header/Header';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { useCart } from '../../components/CartContext';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 30,
  },
  emptyBox: {
    flex: 1,
    marginTop: 40,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: FONTS.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
