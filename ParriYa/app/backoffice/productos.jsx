import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api, { resolveProductImg, resolveCategoryImg } from '../../services/api';


function showConfirmDialog(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
    ]);
  }
}


async function performDeleteApi(productId, nombre, onSuccess) {
  try {
    await api.delete(`/productos/${productId}`);
    const msg = `Se eliminó "${nombre}" del catálogo.`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Eliminado', msg);
    }
    onSuccess();
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    const errMsg = 'No se pudo eliminar el producto del servidor.';
    if (Platform.OS === 'web') {
      window.alert(errMsg);
    } else {
      Alert.alert('Error', errMsg);
    }
  }
}


function getCategoryCardStyle(isActive, colors, isDarkMode) {
  if (isActive) return [styles.categoryFilterCard, styles.categoryFilterCardActive];
  return [
    styles.categoryFilterCard,
    styles.categoryFilterCardInactive,
    { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : 'transparent', borderWidth: isDarkMode ? 1 : 0 },
  ];
}

function getCategoryTextStyle(isActive, colors) {
  if (isActive) return styles.categoryFilterTextActive;
  return [styles.categoryFilterTextInactive, { color: colors.text }];
}

export default function BackofficeProductos() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todo');
  const [categoriesList, setCategoriesList] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [nombreInput, setNombreInput] = useState('');
  const [descripcionInput, setDescripcionInput] = useState('');
  const [precioInput, setPrecioInput] = useState('');
  const [imgUrlInput, setImgUrlInput] = useState('');
  const [selectedCategoryOptionId, setSelectedCategoryOptionId] = useState('1');
  const [stockInput, setStockInput] = useState('10');

  const loadCategories = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

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
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

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


  const productosFiltrados = products.filter((p) => {
    if (selectedCategoryFilter === 'Todo') return true;
    const cat = categoriesList.find((c) => c.id === p.categoria_id);
    return cat && cat.nombre === selectedCategoryFilter;
  });


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


  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setNombreInput(product.nombre);
    setDescripcionInput(product.descripcion);
    setPrecioInput(product.precio.toString());

    const isWebUrl = typeof product.img_url === 'string' &&
      (product.img_url.startsWith('http://') || product.img_url.startsWith('https://'));
    setImgUrlInput(isWebUrl ? product.img_url : '');

    setSelectedCategoryOptionId(product.categoria_id || '1');
    setStockInput((product.stock || 10).toString());
    setModalVisible(true);
  };


  const handleSaveProduct = async () => {
    if (!nombreInput || !descripcionInput || !precioInput) {
      Alert.alert('Campos incompletos', 'Por favor completa nombre, descripción y precio.');
      return;
    }

    const precioNum = parseFloat(precioInput);
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Precio inválido', 'El precio debe ser un número positivo.');
      return;
    }

    try {
      const fallbackLogoUrl = 'https://raw.githubusercontent.com/alejotaccone/ParriYa_Frontend/main/assets/images/Logo.png';
      const stockNum = parseInt(stockInput, 10);

      const usesFallback = editingProduct && !imgUrlInput.trim() && typeof editingProduct.img_url !== 'string';
      const finalImg = usesFallback ? fallbackLogoUrl : (imgUrlInput.trim() || fallbackLogoUrl);

      const body = {
        nombre: nombreInput,
        descripcion: descripcionInput,
        precio: precioNum,
        stock: isNaN(stockNum) ? 10 : stockNum,
        imgUrl: finalImg,
        categoriaId: parseInt(selectedCategoryOptionId, 10)
      };

      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id}`, body);
        Alert.alert('Producto editado', `Se guardaron los cambios del producto "${nombreInput}".`);
      } else {
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


  const handleDelete = () => {
    if (!editingProduct) return;
    showConfirmDialog(
      'Eliminar producto',
      '¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.',
      () => performDeleteApi(editingProduct.id, editingProduct.nombre, async () => {
        setModalVisible(false);
        await loadProducts();
      })
    );
  };


  const handleDeleteProduct = (productId, nombre) => {
    showConfirmDialog(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${nombre}" del catálogo de la base de datos?`,
      () => performDeleteApi(productId, nombre, loadProducts)
    );
  };


  const handleLogout = () => {
    const doLogout = async () => {
      await AsyncStorage.removeItem('activeUser');
      await AsyncStorage.removeItem('authToken');
      router.replace('/login');
    };
    showConfirmDialog(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir del panel de administración?',
      doLogout
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

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
            style={styles.productHeaderAddButton}
            onPress={handleOpenCreateModal}
          >
            <Ionicons name="add-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- FILTRO DE CATEGORÍAS --- */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {/* Tarjeta "Todo" */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={getCategoryCardStyle(selectedCategoryFilter === 'Todo', colors, isDarkMode)}
            onPress={() => setSelectedCategoryFilter('Todo')}
          >
            <Text style={getCategoryTextStyle(selectedCategoryFilter === 'Todo', colors)}>
              Todo
            </Text>
          </TouchableOpacity>

          {/* Tarjetas por categoría */}
          {categoriesList.map((cat) => {
            const isActive = cat.nombre === selectedCategoryFilter;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={getCategoryCardStyle(isActive, colors, isDarkMode)}
                onPress={() => setSelectedCategoryFilter(cat.nombre)}
              >
                <Text style={getCategoryTextStyle(isActive, colors)}>
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
        contentContainerStyle={styles.productScrollContent}
      >
        {productosFiltrados.length === 0 ? (
          <Text style={[styles.productEmptyText, { color: colors.textMuted }]}>
            No hay productos registrados en esta categoría.
          </Text>
        ) : (
          productosFiltrados.map((item) => {
            const catName = categoriesList.find((c) => c.id === item.categoria_id)?.nombre || 'Categoría';
      const imgSource = typeof item.img_url !== 'string' ? item.img_url : { uri: item.img_url };

            return (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.productCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isDarkMode ? colors.border : 'transparent',
                    borderWidth: isDarkMode ? 1 : 0,
                  }
                ]}
                activeOpacity={0.9}
                onLongPress={() => handleDeleteProduct(item.id, item.nombre)}
              >
                {/* Imagen del producto */}
                <View style={[styles.productCardImageContainer, { backgroundColor: isDarkMode ? colors.box : '#F5F5F5' }]}>
                  <Image
                    source={imgSource}
                    style={styles.productCardImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Contenido descriptivo */}
                <View style={styles.productCardContent}>
                  <Text style={[styles.productCardName, { color: colors.text }]}>{item.nombre}</Text>
                  <Text style={styles.productCardCategory}>{catName}</Text>
                  <Text style={[styles.productCardDescription, { color: colors.textMuted }]} numberOfLines={2}>
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
          <View style={[
            styles.modalCard,
            {
              width: '92%',
              maxWidth: 450,
              maxHeight: '90%',
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : 'transparent',
              borderWidth: isDarkMode ? 1 : 0
            }
          ]}>
            
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingProduct ? 'Editar producto' : 'Crear producto'}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productModalScrollContent}>

              <ModalImagePreview
                imgUrlInput={imgUrlInput}
                editingProduct={editingProduct}
                isDarkMode={isDarkMode}
                colors={colors}
                stylesCont={styles}
              />

              {/* Input: Nombre del Producto */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Nombre</Text>
                <TextInput
                  style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                  placeholder="Ej: Lomo a la parrilla"
                  placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                  value={nombreInput}
                  onChangeText={setNombreInput}
                />
              </View>

              {/* Input: Descripción */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Descripción</Text>
                <TextInput
                  style={[styles.addModalTextInput, { height: 80, textAlignVertical: 'top', backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                  placeholder="Corte premium de lomo, tierno y jugoso..."
                  placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                  multiline={true}
                  numberOfLines={4}
                  value={descripcionInput}
                  onChangeText={setDescripcionInput}
                />
              </View>

              {/* Input: URL de Imagen */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>URL de la Imagen (Web)</Text>
                <TextInput
                  style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                  placeholder="https://example.com/imagen.png"
                  placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                  autoCapitalize="none"
                  value={imgUrlInput}
                  onChangeText={setImgUrlInput}
                />
              </View>

              {/* Input: Precio */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Precio ($)</Text>
                <TextInput
                  style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                  placeholder="20000"
                  placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                  keyboardType="numeric"
                  value={precioInput}
                  onChangeText={setPrecioInput}
                />
              </View>

              {/* Input: Stock de BDD */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Stock en Inventario</Text>
                <TextInput
                  style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                  placeholder="10"
                  placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                  keyboardType="numeric"
                  value={stockInput}
                  onChangeText={setStockInput}
                />
              </View>

              {/* Selector de Categorías */}
              <View style={styles.addModalInputWrapper}>
                <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productModalCategoryScroll}>
                  {categoriesList.map((cat) => {
                    const isSelected = cat.id === selectedCategoryOptionId;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.statusOptionButton,
                          { marginHorizontal: 4, marginVertical: 0, paddingVertical: 8, paddingHorizontal: 12 },
                          isSelected 
                            ? styles.statusBtnActivePreparando 
                            : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }]
                        ]}
                        onPress={() => setSelectedCategoryOptionId(cat.id)}
                      >
                        <Text style={[
                          styles.statusBtnText, 
                          isDarkMode && { color: colors.textMuted },
                          isSelected && styles.statusBtnTextActivePreparando, 
                          { marginLeft: 0 }
                        ]}>
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

              {/* Botón para Eliminar Producto (solo al editar) */}
              {editingProduct && (
                <TouchableOpacity
                  style={styles.modalDeleteButton}
                  activeOpacity={0.8}
                  onPress={handleDelete}
                >
                  <Text style={styles.modalDeleteButtonText}>Eliminar producto</Text>
                </TouchableOpacity>
              )}

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
          onPress={handleOpenCreateModal}
        >
          <Ionicons name="add" size={32} color={COLORS.primary} />
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


function ModalImagePreview({ imgUrlInput, editingProduct, isDarkMode, colors, stylesCont }) {
  const containerStyle = [
    stylesCont.modalImagePlaceholder,
    { backgroundColor: isDarkMode ? colors.box : '#F5F5F5', borderColor: isDarkMode ? colors.border : '#E5E5EA' }
  ];

  // Caso 1: hay una URL nueva escrita en el input
  if (imgUrlInput.trim()) {
    return (
      <View style={containerStyle}>
        <Image 
          source={{ uri: imgUrlInput.trim() }}
          style={stylesCont.modalImagePreview}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Caso 2: editando un producto con imagen local (asset requerido)
  if (editingProduct && typeof editingProduct.img_url !== 'string') {
    return (
      <View style={containerStyle}>
        <Image 
          source={editingProduct.img_url}
          style={stylesCont.modalImagePreview}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Caso 3: placeholder vacío
  return (
    <View style={containerStyle}>
      <View style={[stylesCont.modalImagePlaceholderBox, { backgroundColor: isDarkMode ? colors.box : '#F5F5F5' }]}>
        <Ionicons name="image-outline" size={40} color="#C5C5C9" />
        <Text style={[stylesCont.modalImageText, { color: colors.textMuted }]}>Cambiar imagen</Text>
      </View>
    </View>
  );
}
