import React, { useMemo, useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header/Header';
import FiltrosCategoria from '../../components/FiltrosCategoria/FiltrosCategoria';
import ProductoCard from '../../components/ProductoCard/ProductoCard';
import { useCart } from '../../components/CartContext';
import { useSearch } from '../../components/SearchContext';
import { styles } from '../../components/Categoria/categoria.styles';
import api, { resolveCategoryImg, resolveProductImg } from '../../services/api';

export default function CategoriaScreen() {
  const { categoriaSeleccionada } = useLocalSearchParams();
  const [filtroActivo, setFiltroActivo] = useState(categoriaSeleccionada || 'Todo');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categorias'),
          api.get('/productos')
        ]);
        
        let cats = [];
        if (catRes.data && catRes.data.length > 0) {
          cats = catRes.data.map(c => ({
            id: String(c.id),
            nombre: c.nombre,
            img_url: resolveCategoryImg(c.nombre, c.imgUrl || c.img_url)
          }));
        }
        setCategorias(cats);

        let prods = [];
        if (prodRes.data && prodRes.data.length > 0) {
          prods = prodRes.data.map(p => ({
            id: String(p.id),
            nombre: p.nombre,
            descripcion: p.descripcion,
            categoria_id: String(p.categoriaId !== undefined ? p.categoriaId : p.categoria_id),
            precio: p.precio,
            img_url: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
            estado: p.estado
          }));
        }
        setProductos(prods);
      } catch (err) {
        console.warn('Error al buscar categorías/productos del backend:', err.message);
        setCategorias([]);
        setProductos([]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      setFiltroActivo(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const { busquedaGlobal } = useSearch();
  const { favoriteItems, toggleFavorite, isFavorite } = useCart();

  const FILTROS = useMemo(() => ['Todo', ...categorias.map((c) => c.nombre)], [categorias]);

  const PRODUCTOS_DATA = useMemo(
    () =>
      productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        desc: p.descripcion || p.desc,
        descripcion: p.descripcion,
        fav: isFavorite(p.id),
        image: p.img_url,
        categoria_id: p.categoria_id,
        precio: p.precio,
      })),
    [productos, favoriteItems]
  );

  const productosFiltrados = useMemo(
    () =>
      PRODUCTOS_DATA.filter(
        (item) =>
          (filtroActivo === 'Todo' ||
            item.categoria_id ===
              categorias.find((cat) => cat.nombre === filtroActivo)?.id) &&
          item.nombre.toLowerCase().includes(busquedaGlobal.toLowerCase())
      ),
    [PRODUCTOS_DATA, filtroActivo, busquedaGlobal, categorias]
  );

  return (
    <View style={styles.container}>
      <Header />

      <FiltrosCategoria
        filtros={FILTROS}
        filtroActivo={filtroActivo}
        setFiltroActivo={setFiltroActivo}
      />

      <FlatList
        data={productosFiltrados}
        renderItem={({ item }) => (
          <ProductoCard item={item} onToggleFavorite={toggleFavorite} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}