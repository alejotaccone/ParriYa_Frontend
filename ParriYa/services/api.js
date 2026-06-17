import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL del servidor Spring Boot
export const API_BASE_URL = 'https://rejoin-reshape-unstitch.ngrok-free.dev';

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


function isValidHttpUrl(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}


const PRODUCT_IMG_MAP = [
  { keywords: ['lomo'],                              image: require('../assets/images/prod_lomo.png') },
  { keywords: ['chori'],                             image: require('../assets/images/prod_chori.png') },
  { keywords: ['asado', 'ribs', 'pollo'],            image: require('../assets/images/prod_asado.png') },
  { keywords: ['sandwich'],                          image: require('../assets/images/prod_sandwich.png') },
  { keywords: ['vacio', 'vacío'],                    image: require('../assets/images/prod_vacio.png') },
  { keywords: ['papa'],                              image: require('../assets/images/prod_papasfritas.png') },
  { keywords: ['coca', 'zero'], matchAll: true,      image: require('../assets/images/prod_cocazero.png') },
  { keywords: ['coca'],                              image: require('../assets/images/prod_coca.png') },
  { keywords: ['sprite'],                            image: require('../assets/images/prod_sprite.png') },
];

const CATEGORY_IMG_MAP = [
  { keywords: ['carne'],   image: require('../assets/images/cat_carnes.png') },
  { keywords: ['sandw'],   image: require('../assets/images/cat_sandwiches.png') },
  { keywords: ['pasta'],   image: require('../assets/images/cat_pastas.png') },
  { keywords: ['guarni'],  image: require('../assets/images/cat_guarniciones.png') },
  { keywords: ['bebida'],  image: require('../assets/images/cat_bebidas.png') },
];


function matchImageFromMap(map, searchStr) {
  const entry = map.find((e) => {
    if (e.matchAll) {
      return e.keywords.every((kw) => searchStr.includes(kw));
    }
    return e.keywords.some((kw) => searchStr.includes(kw));
  });
  return entry ? entry.image : null;
}

// Resolutores de imágenes locales vs remotas
export const resolveCategoryImg = (nombre, imgUrl) => {
  if (isValidHttpUrl(imgUrl)) return { uri: imgUrl };
  if (imgUrl && typeof imgUrl !== 'string') return imgUrl;

  const nameLower = (nombre || '').toLowerCase();
  return matchImageFromMap(CATEGORY_IMG_MAP, nameLower)
    || require('../assets/images/cat_carnes.png');
};

export const resolveProductImg = (nombre, imgUrl) => {
  if (isValidHttpUrl(imgUrl)) return { uri: imgUrl };
  if (imgUrl && typeof imgUrl !== 'string') return imgUrl;

  const searchStr = [
    typeof imgUrl === 'string' ? imgUrl.toLowerCase() : '',
    (nombre || '').toLowerCase(),
  ].join(' ');

  return matchImageFromMap(PRODUCT_IMG_MAP, searchStr)
    || require('../assets/images/prod_lomo.png');
};

export default api;
