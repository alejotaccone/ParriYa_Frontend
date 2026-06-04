import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import api, { resolveProductImg, resolveCategoryImg } from '../../services/api';

export default function BackofficeProductos() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todo');
  const [categoriesList, setCategoriesList] = useState([]);

  // Estados del Formulario Modal (ABM)
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Crear, productObj = Editar
  const [nombreInput, setNombreInput] = useState('');
  const [descripcionInput, setDescripcionInput] = useState('');
  const [precioInput, setPrecioInput] = useState('');
  const [imgUrlInput, setImgUrlInput] = useState('');
  const [selectedCategoryOptionId, setSelectedCategoryOptionId] = useState('1'); // Carnes por defecto
  const [stockInput, setStockInput] = useState('10');

  const loadCategories = async () => {
    try {
      const response = await api.get('/categorias');
      if (response.data && response.data.length > 0) {
        const mapped = response.data.map(c => ({
          id: String(c.id),
          nombre: c.nombre,
          img_url: resolveCategoryImg(c.nombre, c.imgUrl || c.img_url)
        }));
        setCategoriesList(mapped);
      } else {
        setCategoriesList([]);
      }
    } catch (e) {
      console.warn('Error cargando categorias backoffice:', e.message);
      setCategoriesList([]);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/productos');
      if (response.data && response.data.length > 0) {
        const mapped = response.data.map((p) => ({
          id: String(p.id),
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          stock: p.stock,
          img_url: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
          categoria_id: String(p.categoriaId !== undefined ? p.categoriaId : p.categoria_id),
          estado: p.estado,
        }));
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.warn('Error cargando productos backoffice:', e.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // Filtra los productos de acuerdo a la categoría seleccionada
  const productosFiltrados = products.filter((p) => {
    if (selectedCategoryFilter === 'Todo') return true;
    
    // Obtenemos el nombre de la categoria correspondiente a p.categoria_id
    const cat = categoriesList.find((c) => c.id === p.categoria_id);
    return cat && cat.nombre === selectedCategoryFilter;
  });

  // Abre el modal para Crear un producto
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setNombreInput('');
    setDescripcionInput('');
    setPrecioInput('');
    setImgUrlInput('');
    setSelectedCategoryOptionId(categoriesList[0]?.id || '1');
    setStockInput('10');
    setModalVisible(true);
  };

  // Abre el modal para Editar un producto
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setNombreInput(product.nombre);
    setDescripcionInput(product.descripcion);
    setPrecioInput(product.precio.toString());
    
    // Si la imagen es una URL de la web (string), la asignamos al input, sino la dejamos vacía
    if (typeof product.img_url === 'string' && (product.img_url.startsWith('http://') || product.img_url.startsWith('https://'))) {
      setImgUrlInput(product.img_url);
    } else {
      setImgUrlInput('');
    }
    
    setSelectedCategoryOptionId(product.categoria_id || '1');
    setStockInput((product.stock || 10).toString());
    setModalVisible(true);
  };

  // Guarda los cambios del producto (Crear / Editar) en la BDD a través de Axios
  const handleSaveProduct = async () => {
    if (!nombreInput || !descripcionInput || !precioInput) {
      Alert.alert('Campos incompletos', 'Por favor completa nombre, descripción y precio.');
      return;
    }

    const precioNum = parseFloat(precioInput);
    const stockNum = parseInt(stockInput, 10);
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Precio inválido', 'El precio debe ser un número positivo.');
      return;
    }

    try {
      const fallbackLogoUrl = 'https://raw.githubusercontent.com/alejotaccone/ParriYa_Frontend/main/assets/images/Logo.png';
      let finalImg = imgUrlInput.trim() || fallbackLogoUrl;

      if (editingProduct && !imgUrlInput.trim() && typeof editingProduct.img_url !== 'string') {
        finalImg = fallbackLogoUrl;
      }

      const body = {
        nombre: nombreInput,
        descripcion: descripcionInput,
        precio: precioNum,
        stock: isNaN(stockNum) ? 10 : stockNum,
        imgUrl: finalImg,
        categoriaId: parseInt(selectedCategoryOptionId, 10)
      };

      if (editingProduct) {
        // --- MODO EDICIÓN BACKEND ---
        await api.put(`/productos/${editingProduct.id}`, body);
        Alert.alert('Producto editado', `Se guardaron los cambios del producto "${nombreInput}".`);
      } else {
        // --- MODO CREACIÓN BACKEND ---
        await api.post('/productos', body);
        Alert.alert('Producto creado', `Se agregó "${nombreInput}" al catálogo de productos.`);
      }

      await loadProducts();
      setModalVisible(false);
    } catch (e) {
      console.error('Error al guardar producto:', e.response?.data || e.message);
      Alert.alert('Error', 'No se pudo guardar el producto en el servidor.');
    }
  };

  // Función para gestionar y eliminar productos
  const handleDeleteProduct = (productId, nombre) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${nombre}" del catálogo de la base de datos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/productos/${productId}`);
              Alert.alert('Eliminado', `Se eliminó "${nombre}" del catálogo.`);
              await loadProducts();
            } catch (err) {
              console.error('Error al eliminar producto:', err.message);
              Alert.alert('Error', 'No se pudo eliminar el producto del servidor.');
            }
          },
        },
      ]
    );
  };

  // Cierre de Sesión
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir del panel de administración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('activeUser');
            await AsyncStorage.removeItem('authToken');
            router.replace('/login');
          },
        },
      ]
    );
  };


  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* --- HEADER CON VOLVER Y BOTÓN AGREGAR (+) --- */}
      <View style={styles.header}>
        <View style={styles.backHeaderRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.backHeaderTitle}>Productos</Text>

          {/* Botón superior derecho para añadir un nuevo producto */}
          <TouchableOpacity 
            style={{ position: 'absolute', right: 20, padding: 5, zIndex: 10 }}
            onPress={handleOpenCreateModal}
          >
            <Ionicons name="add-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CATEGORIAS CAROUSEL FILTER BAR --- */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {/* Opción Todo */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.categoryFilterCard,
              selectedCategoryFilter === 'Todo' ? styles.categoryFilterCardActive : styles.categoryFilterCardInactive,
            ]}
            onPress={() => setSelectedCategoryFilter('Todo')}
          >
            <Text
              style={
                selectedCategoryFilter === 'Todo' ? styles.categoryFilterTextActive : styles.categoryFilterTextInactive
              }
            >
              Todo
            </Text>
          </TouchableOpacity>

          {/* Resto de Categorías de la BDD */}
          {categoriesList.map((cat) => {
            const isActive = cat.nombre === selectedCategoryFilter;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={[
                  styles.categoryFilterCard,
                  isActive ? styles.categoryFilterCardActive : styles.categoryFilterCardInactive,
                ]}
                onPress={() => setSelectedCategoryFilter(cat.nombre)}
              >
                <Text
                  style={
                    isActive ? styles.categoryFilterTextActive : styles.categoryFilterTextInactive
                  }
                >
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- LISTADO DEL CATÁLOGO DE PRODUCTOS --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {productosFiltrados.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#8E8E93', marginVertical: 30 }}>
            No hay productos registrados en esta categoría.
          </Text>
        ) : (
          productosFiltrados.map((item) => {
            const catName = categoriesList.find((c) => c.id === item.categoria_id)?.nombre || 'Categoría';
            const isLocalAsset = typeof item.img_url !== 'string';

            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productCard}
                activeOpacity={0.9}
                onLongPress={() => handleDeleteProduct(item.id, item.nombre)}
              >
                {/* Imagen del producto */}
                <View style={styles.productCardImageContainer}>
                  <Image
                    source={isLocalAsset ? item.img_url : { uri: item.img_url }}
                    style={styles.productCardImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Contenido descriptivo */}
                <View style={styles.productCardContent}>
                  <Text style={styles.productCardName}>{item.nombre}</Text>
                  <Text style={styles.productCardCategory}>{catName}</Text>
                  <Text style={styles.productCardDescription} numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                </View>

                {/* Botón de Edición del producto */}
                <TouchableOpacity 
                  style={styles.productEditButton}
                  activeOpacity={0.7}
                  onPress={() => handleOpenEditModal(item)}
                >
                  <Ionicons name="pencil" size={18} color="white" />
                </TouchableOpacity>

              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* --- CUSTOM POPUP MODAL (ABM PRODUCTOS - CREAR / EDITAR) --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: '92%', maxWidth: 450, maxHeight: '90%' }]}>
            
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Editar producto' : 'Crear producto'}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
              
              {/* Box de Previsualización Dinámica por URL de Imagen */}
              <View style={styles.modalImagePlaceholder}>
                {imgUrlInput.trim() ? (
                  <Image 
                    source={{ uri: imgUrlInput.trim() }}
                    style={styles.modalImagePreview}
                    resizeMode="cover"
                  />
                ) : editingProduct && typeof editingProduct.img_url !== 'string' ? (
                  <Image 
                    source={editingProduct.img_url}
                    style={styles.modalImagePreview}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.modalImagePlaceholderBox}>
                    <Ionicons name="image-outline" size={40} color="#C5C5C9" />
                    <Text style={styles.modalImageText}>Cambiar imagen</Text>
                  </View>
                )}
              </View>

              {/* Input: Nombre del Producto */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>Nombre</Text>
                <TextInput
                  style={styles.addModalTextInput}
                  placeholder="Ej: Lomo a la parrilla"
                  placeholderTextColor="#8E8E93"
                  value={nombreInput}
                  onChangeText={setNombreInput}
                />
              </View>

              {/* Input: Descripción */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>Descripción</Text>
                <TextInput
                  style={[styles.addModalTextInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Corte premium de lomo, tierno y jugoso..."
                  placeholderTextColor="#8E8E93"
                  multiline={true}
                  numberOfLines={4}
                  value={descripcionInput}
                  onChangeText={setDescripcionInput}
                />
              </View>

              {/* Input: URL de Imagen */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>URL de la Imagen (Web)</Text>
                <TextInput
                  style={styles.addModalTextInput}
                  placeholder="https://example.com/imagen.png"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="none"
                  value={imgUrlInput}
                  onChangeText={setImgUrlInput}
                />
              </View>

              {/* Input: Precio */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>Precio ($)</Text>
                <TextInput
                  style={styles.addModalTextInput}
                  placeholder="20000"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={precioInput}
                  onChangeText={setPrecioInput}
                />
              </View>

              {/* Input: Stock de BDD */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>Stock en Inventario</Text>
                <TextInput
                  style={styles.addModalTextInput}
                  placeholder="10"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={stockInput}
                  onChangeText={setStockInput}
                />
              </View>

              {/* Selector de Categorías */}
              <View style={styles.addModalInputWrapper}>
                <Text style={styles.addModalInputLabel}>Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
                  {categoriesList.map((cat) => {
                    const isSelected = cat.id === selectedCategoryOptionId;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.statusOptionButton,
                          { marginHorizontal: 4, marginVertical: 0, paddingVertical: 8, paddingHorizontal: 12 },
                          isSelected ? styles.statusBtnActivePreparando : styles.statusBtnInactive
                        ]}
                        onPress={() => setSelectedCategoryOptionId(cat.id)}
                      >
                        <Text style={[styles.statusBtnText, isSelected && styles.statusBtnTextActivePreparando, { marginLeft: 0 }]}>
                          {cat.nombre}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Botón de Confirmación final */}
              <TouchableOpacity
                style={styles.modalConfirmButton}
                activeOpacity={0.8}
                onPress={handleSaveProduct}
              >
                <Text style={styles.modalConfirmButtonText}>Guardar</Text>
              </TouchableOpacity>

            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => router.replace('/backoffice')}
        >
          <Ionicons name="home" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={handleOpenCreateModal} // Al estar en esta pantalla, + abre directamente la creación de producto
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/backoffice/perfil')}
        >
          <Ionicons name="person" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
