import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { useProductosStyles } from '../../components/Backoffice/productos.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api, { resolveProductImg, resolveCategoryImg } from '../../services/api';

// ─── Helpers de módulo ────────────────────────────────────────────

function showConfirmDialog(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
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
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Eliminado', msg);
    onSuccess();
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    const errMsg = 'No se pudo eliminar el producto del servidor.';
    Platform.OS === 'web' ? window.alert(errMsg) : Alert.alert('Error', errMsg);
  }
}

async function isAdminUser() {
  const json = await AsyncStorage.getItem('activeUser');
  if (!json) return false;
  return JSON.parse(json).rol === 'admin';
}

function mapCategoriesResponse(data) {
  return data.map(c => ({
    id: String(c.id),
    nombre: c.nombre,
    img_url: resolveCategoryImg(c.nombre, c.imgUrl || c.img_url),
  }));
}

function mapProductsResponse(data) {
  return data.map(p => ({
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    stock: p.stock,
    img_url: resolveProductImg(p.nombre, p.imgUrl || p.img_url),
    categoria_id: String(p.categoriaId !== undefined ? p.categoriaId : p.categoria_id),
    estado: p.estado,
  }));
}

// ─── Custom Hook: lógica de negocio ──────────────────────────────

function useProductosLogic(router) {
  const [products, setProducts]                       = useState([]);
  const [categoriesList, setCategoriesList]           = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todo');
  const [modalVisible, setModalVisible]               = useState(false);
  const [editingProduct, setEditingProduct]           = useState(null);
  const [nombreInput, setNombreInput]                 = useState('');
  const [descripcionInput, setDescripcionInput]       = useState('');
  const [precioInput, setPrecioInput]                 = useState('');
  const [imgUrlInput, setImgUrlInput]                 = useState('');
  const [selectedCategoryOptionId, setSelectedCategoryOptionId] = useState('1');
  const [stockInput, setStockInput]                   = useState('10');

  const loadCategories = async () => {
    try {
      if (!(await isAdminUser())) return;
      const response = await api.get('/categorias');
      setCategoriesList(response.data?.length > 0 ? mapCategoriesResponse(response.data) : []);
    } catch (e) {
      console.warn('Error cargando categorias backoffice:', e.message);
      setCategoriesList([]);
    }
  };

  const loadProducts = async () => {
    try {
      if (!(await isAdminUser())) return;
      const response = await api.get('/productos');
      setProducts(response.data?.length > 0 ? mapProductsResponse(response.data) : []);
    } catch (e) {
      console.warn('Error cargando productos backoffice:', e.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const productosFiltrados = products.filter(p => {
    if (selectedCategoryFilter === 'Todo') return true;
    const cat = categoriesList.find(c => c.id === p.categoria_id);
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
    const precioNum = Number.parseFloat(precioInput);
    if (Number.isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Precio inválido', 'El precio debe ser un número positivo.');
      return;
    }
    try {
      const fallback = 'https://raw.githubusercontent.com/alejotaccone/ParriYa_Frontend/main/assets/images/Logo.png';
      const stockNum = Number.parseInt(stockInput, 10);
      const usesFallback = editingProduct && !imgUrlInput.trim() && typeof editingProduct.img_url !== 'string';
      const body = {
        nombre: nombreInput,
        descripcion: descripcionInput,
        precio: precioNum,
        stock: Number.isNaN(stockNum) ? 10 : stockNum,
        imgUrl: usesFallback ? fallback : (imgUrlInput.trim() || fallback),
        categoriaId: Number.parseInt(selectedCategoryOptionId, 10),
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
    showConfirmDialog('Cerrar Sesión', '¿Estás seguro de que quieres salir del panel de administración?', doLogout);
  };

  return {
    products,
    categoriesList,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    productosFiltrados,
    modalVisible,
    setModalVisible,
    editingProduct,
    nombreInput, setNombreInput,
    descripcionInput, setDescripcionInput,
    precioInput, setPrecioInput,
    imgUrlInput, setImgUrlInput,
    selectedCategoryOptionId, setSelectedCategoryOptionId,
    stockInput, setStockInput,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSaveProduct,
    handleDelete,
    handleDeleteProduct,
    handleLogout,
  };
}

// ─── Sub-componentes ──────────────────────────────────────────────

function ProductCardItem({ item, categoriesList, dynStyles, onEdit, onDelete }) {
  const catName   = categoriesList.find(c => c.id === item.categoria_id)?.nombre || 'Categoría';
  const imgSource = typeof item.img_url !== 'string' ? item.img_url : { uri: item.img_url };
  return (
    <TouchableOpacity
      style={dynStyles.productCard}
      activeOpacity={0.9}
      onLongPress={() => onDelete(item.id, item.nombre)}
    >
      <View style={dynStyles.productCardImageContainer}>
        <Image source={imgSource} style={styles.productCardImage} resizeMode="cover" />
      </View>
      <View style={styles.productCardContent}>
        <Text style={dynStyles.productCardName}>{item.nombre}</Text>
        <Text style={styles.productCardCategory}>{catName}</Text>
        <Text style={dynStyles.productCardDescription} numberOfLines={2}>{item.descripcion}</Text>
      </View>
      <TouchableOpacity style={styles.productEditButton} activeOpacity={0.7} onPress={() => onEdit(item)}>
        <Ionicons name="pencil" size={18} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

ProductCardItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    categoria_id: PropTypes.string.isRequired,
    img_url: PropTypes.any,
  }).isRequired,
  categoriesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  dynStyles: PropTypes.shape({
    productCard: PropTypes.any,
    productCardImageContainer: PropTypes.any,
    productCardName: PropTypes.any,
    productCardDescription: PropTypes.any,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function ModalCategorySelector({ categoriesList, selectedCategoryOptionId, onSelect, dynStyles }) {
  return (
    <View style={styles.addModalInputWrapper}>
      <Text style={dynStyles.inputLabel}>Categoría</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productModalCategoryScroll}>
        {categoriesList.map(cat => {
          const isSelected = cat.id === selectedCategoryOptionId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={isSelected ? dynStyles.catBtnSelected : dynStyles.catBtnUnselected}
              onPress={() => onSelect(cat.id)}
            >
              <Text style={isSelected ? dynStyles.catBtnTextSelected : dynStyles.catBtnTextUnselected}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

ModalCategorySelector.propTypes = {
  categoriesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategoryOptionId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  dynStyles: PropTypes.shape({
    inputLabel: PropTypes.any,
    catBtnSelected: PropTypes.any,
    catBtnUnselected: PropTypes.any,
    catBtnTextSelected: PropTypes.any,
    catBtnTextUnselected: PropTypes.any,
  }).isRequired,
};

function ModalImagePreview({ imgUrlInput, editingProduct, dynStyles }) {
  if (imgUrlInput.trim()) {
    return (
      <View style={dynStyles.modalImageContainer}>
        <Image source={{ uri: imgUrlInput.trim() }} style={styles.modalImagePreview} resizeMode="cover" />
      </View>
    );
  }
  if (editingProduct && typeof editingProduct.img_url !== 'string') {
    return (
      <View style={dynStyles.modalImageContainer}>
        <Image source={editingProduct.img_url} style={styles.modalImagePreview} resizeMode="cover" />
      </View>
    );
  }
  return (
    <View style={dynStyles.modalImageContainer}>
      <View style={dynStyles.modalImagePlaceholderBox}>
        <Ionicons name="image-outline" size={40} color="#C5C5C9" />
        <Text style={dynStyles.modalImageText}>Cambiar imagen</Text>
      </View>
    </View>
  );
}

ModalImagePreview.propTypes = {
  imgUrlInput: PropTypes.string.isRequired,
  editingProduct: PropTypes.shape({
    img_url: PropTypes.any,
  }),
  dynStyles: PropTypes.shape({
    modalImageContainer: PropTypes.any,
    modalImagePlaceholderBox: PropTypes.any,
    modalImageText: PropTypes.any,
  }).isRequired,
};

// ─── Componente principal ─────────────────────────────────────────

export default function BackofficeProductos() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const dynStyles = useProductosStyles(colors, isDarkMode);
  const logic = useProductosLogic(router);

  return (
    <View style={dynStyles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View style={styles.backHeaderRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.backHeaderTitle}>Productos</Text>
          <TouchableOpacity style={styles.productHeaderAddButton} onPress={logic.handleOpenCreateModal}>
            <Ionicons name="add-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtro de categorías */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={logic.selectedCategoryFilter === 'Todo' ? dynStyles.catFilterActive : dynStyles.catFilterInactive}
            onPress={() => logic.setSelectedCategoryFilter('Todo')}
          >
            <Text style={logic.selectedCategoryFilter === 'Todo' ? dynStyles.catFilterTextActive : dynStyles.catFilterTextInactive}>
              Todo
            </Text>
          </TouchableOpacity>

          {logic.categoriesList.map(cat => {
            const isActive = cat.nombre === logic.selectedCategoryFilter;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={isActive ? dynStyles.catFilterActive : dynStyles.catFilterInactive}
                onPress={() => logic.setSelectedCategoryFilter(cat.nombre)}
              >
                <Text style={isActive ? dynStyles.catFilterTextActive : dynStyles.catFilterTextInactive}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Listado de productos */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productScrollContent}>
        {logic.productosFiltrados.length === 0 ? (
          <Text style={dynStyles.emptyText}>No hay productos registrados en esta categoría.</Text>
        ) : (
          logic.productosFiltrados.map(item => (
            <ProductCardItem
              key={item.id}
              item={item}
              categoriesList={logic.categoriesList}
              dynStyles={dynStyles}
              onEdit={logic.handleOpenEditModal}
              onDelete={logic.handleDeleteProduct}
            />
          ))
        )}
      </ScrollView>

      {/* Modal ABM */}
      <Modal
        visible={logic.modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => logic.setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={dynStyles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={dynStyles.modalTitle}>
                {logic.editingProduct ? 'Editar producto' : 'Crear producto'}
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => logic.setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.productModalScrollContent}>
              <ModalImagePreview
                imgUrlInput={logic.imgUrlInput}
                editingProduct={logic.editingProduct}
                dynStyles={dynStyles}
              />

              <View style={styles.addModalInputWrapper}>
                <Text style={dynStyles.inputLabel}>Nombre</Text>
                <TextInput
                  style={dynStyles.textInput}
                  placeholder="Ej: Lomo a la parrilla"
                  placeholderTextColor={isDarkMode ? colors.textMuted : '#8E8E93'}
                  value={logic.nombreInput}
                  onChangeText={logic.setNombreInput}
                />
              </View>

              <View style={styles.addModalInputWrapper}>
                <Text style={dynStyles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[dynStyles.textInput, dynStyles.textInputMultiline]}
                  placeholder="Corte premium de lomo, tierno y jugoso..."
                  placeholderTextColor={isDarkMode ? colors.textMuted : '#8E8E93'}
                  multiline={true}
                  numberOfLines={4}
                  value={logic.descripcionInput}
                  onChangeText={logic.setDescripcionInput}
                />
              </View>

              <View style={styles.addModalInputWrapper}>
                <Text style={dynStyles.inputLabel}>URL de la Imagen (Web)</Text>
                <TextInput
                  style={dynStyles.textInput}
                  placeholder="https://example.com/imagen.png"
                  placeholderTextColor={isDarkMode ? colors.textMuted : '#8E8E93'}
                  autoCapitalize="none"
                  value={logic.imgUrlInput}
                  onChangeText={logic.setImgUrlInput}
                />
              </View>

              <View style={styles.addModalInputWrapper}>
                <Text style={dynStyles.inputLabel}>Precio ($)</Text>
                <TextInput
                  style={dynStyles.textInput}
                  placeholder="20000"
                  placeholderTextColor={isDarkMode ? colors.textMuted : '#8E8E93'}
                  keyboardType="numeric"
                  value={logic.precioInput}
                  onChangeText={logic.setPrecioInput}
                />
              </View>

              <View style={styles.addModalInputWrapper}>
                <Text style={dynStyles.inputLabel}>Stock en Inventario</Text>
                <TextInput
                  style={dynStyles.textInput}
                  placeholder="10"
                  placeholderTextColor={isDarkMode ? colors.textMuted : '#8E8E93'}
                  keyboardType="numeric"
                  value={logic.stockInput}
                  onChangeText={logic.setStockInput}
                />
              </View>

              <ModalCategorySelector
                categoriesList={logic.categoriesList}
                selectedCategoryOptionId={logic.selectedCategoryOptionId}
                onSelect={logic.setSelectedCategoryOptionId}
                dynStyles={dynStyles}
              />

              <TouchableOpacity style={styles.modalConfirmButton} activeOpacity={0.8} onPress={logic.handleSaveProduct}>
                <Text style={styles.modalConfirmButtonText}>Guardar</Text>
              </TouchableOpacity>

              {logic.editingProduct && (
                <TouchableOpacity style={styles.modalDeleteButton} activeOpacity={0.8} onPress={logic.handleDelete}>
                  <Text style={styles.modalDeleteButtonText}>Eliminar producto</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/backoffice')}>
          <Ionicons name="home" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={logic.handleOpenCreateModal}>
          <Ionicons name="add" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/backoffice/perfil')}>
          <Ionicons name="person" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
