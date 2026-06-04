import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL del servidor Spring Boot
export const API_BASE_URL = 'http://localhost:4002';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para inyectar automáticamente el token JWT en las cabeceras de cada petición
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error al leer el token de autenticación:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Resolutores de imágenes locales vs remotas
export const resolveCategoryImg = (nombre, imgUrl) => {
  if (typeof imgUrl === 'string' && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
    return { uri: imgUrl };
  }
  if (imgUrl && typeof imgUrl !== 'string') {
    return imgUrl;
  }
  const nameLower = (nombre || '').toLowerCase();
  if (nameLower.includes('carne')) return require('../assets/images/cat_carnes.png');
  if (nameLower.includes('sandw')) return require('../assets/images/cat_sandwiches.png');
  if (nameLower.includes('pasta')) return require('../assets/images/cat_pastas.png');
  if (nameLower.includes('guarni')) return require('../assets/images/cat_guarniciones.png');
  if (nameLower.includes('bebida')) return require('../assets/images/cat_bebidas.png');
  return require('../assets/images/cat_carnes.png');
};

export const resolveProductImg = (nombre, imgUrl) => {
  if (typeof imgUrl === 'string' && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
    return { uri: imgUrl };
  }
  if (imgUrl && typeof imgUrl !== 'string') {
    return imgUrl;
  }
  
  const imgStr = typeof imgUrl === 'string' ? imgUrl.toLowerCase() : '';
  const nameLower = (nombre || '').toLowerCase();
  
  if (imgStr.includes('lomo') || nameLower.includes('lomo')) return require('../assets/images/prod_lomo.png');
  if (imgStr.includes('chori') || nameLower.includes('chori')) return require('../assets/images/prod_chori.png');
  if (imgStr.includes('asado') || imgStr.includes('ribs') || imgStr.includes('pollo') || nameLower.includes('asado') || nameLower.includes('ribs') || nameLower.includes('pollo')) return require('../assets/images/prod_asado.png');
  if (imgStr.includes('sandwich') || nameLower.includes('sandwich')) return require('../assets/images/prod_sandwich.png');
  if (imgStr.includes('vacio') || nameLower.includes('vacio') || nameLower.includes('vacío')) return require('../assets/images/prod_vacio.png');
  if (imgStr.includes('papa') || nameLower.includes('papa')) return require('../assets/images/prod_papasfritas.png');
  if ((imgStr.includes('coca') && imgStr.includes('zero')) || (nameLower.includes('coca') && nameLower.includes('zero'))) return require('../assets/images/prod_cocazero.png');
  if (imgStr.includes('coca') || nameLower.includes('coca')) return require('../assets/images/prod_coca.png');
  if (imgStr.includes('sprite') || nameLower.includes('sprite')) return require('../assets/images/prod_sprite.png');
  
  return require('../assets/images/prod_lomo.png');
};

export default api;

