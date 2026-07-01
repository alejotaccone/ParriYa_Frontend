import { Platform } from 'react-native';

let analyticsInstance = null;

// Intentar cargar la librería nativa sólo en plataformas móviles nativas
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const analytics = require('@react-native-firebase/analytics').default;
    analyticsInstance = analytics();
  } catch (error) {
    console.warn('Firebase Analytics no disponible en este build de desarrollo:', error.message);
  }
}

/**
 * Registra un evento personalizado en Firebase Analytics.
 * @param {string} eventName Nombre del evento (ej: 'add_to_cart')
 * @param {object} params Parámetros adicionales
 */
export const logEvent = async (eventName, params = {}) => {
  try {
    if (analyticsInstance) {
      await analyticsInstance.logEvent(eventName, params);
      if (__DEV__) {
        console.log(`[Analytics] Evento registrado nativamente: ${eventName}`, params);
      }
    } else {
      console.log(`[Analytics - Mock/Web] Evento registrado: ${eventName}`, params);
    }
  } catch (error) {
    console.error(`[Analytics] Error registrando evento ${eventName}:`, error.message);
  }
};

/**
 * Registra una vista de pantalla en Firebase Analytics.
 * @param {string} screenName Nombre de la pantalla (ej: 'carrito')
 */
export const logScreenView = async (screenName) => {
  try {
    if (analyticsInstance) {
      await analyticsInstance.logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
      if (__DEV__) {
        console.log(`[Analytics] Vista de pantalla registrada nativamente: ${screenName}`);
      }
    } else {
      console.log(`[Analytics - Mock/Web] Vista de pantalla registrada: ${screenName}`);
    }
  } catch (error) {
    console.error(`[Analytics] Error registrando pantalla ${screenName}:`, error.message);
  }
};
