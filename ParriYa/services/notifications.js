import { Platform } from 'react-native';

// Variable para almacenar el módulo de expo-notifications si se carga correctamente
let Notifications = null;

try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications');

    // Configura cómo debe comportarse la notificación cuando la app está en primer plano
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  console.warn(
    'expo-notifications no se pudo inicializar en este entorno (es común en Expo Go con SDK 53+). ' +
    'Las notificaciones locales se simularán en consola. Error:',
    e.message
  );
  Notifications = null;
}

/**
 * Solicita permisos de notificación al sistema operativo.
 * @returns {Promise<boolean>} True si los permisos fueron concedidos
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web' || !Notifications) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permiso de notificaciones denegado.');
      return false;
    }

    // En Android, necesitamos crear un canal de notificaciones con alta prioridad
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (err) {
    console.warn('Error al solicitar permisos de notificación:', err.message);
    return false;
  }
}

/**
 * Envía una notificación local inmediata o simula en consola si no está disponible.
 * @param {string} title Título de la notificación
 * @param {string} body Cuerpo de la notificación
 * @param {object} data Datos adicionales opcionales
 */
export async function sendLocalNotification(title, body, data = {}) {
  console.log(`[Notificación Local Simulación] ${title} - ${body}`, data);

  if (Platform.OS === 'web' || !Notifications) return;

  try {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // trigger null envía la notificación inmediatamente
    });
  } catch (err) {
    console.warn('Error enviando notificación local:', err.message);
  }
}

/**
 * Programa una notificación para recordar el retiro del pedido programado.
 * @param {string} orderId ID del pedido
 * @param {string} timeStr Rango horario de retiro (ej: "20:30")
 */
export async function schedulePickupReminder(orderId, timeStr) {
  const nowStr = new Date().toLocaleTimeString();
  console.log(`[Programando Alerta Retiro] Pedido #${orderId} programado para las ${timeStr}hs (programado a las ${nowStr})`);

  if (Platform.OS === 'web' || !Notifications) return;

  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Calcular el tiempo de aviso: 15 minutos antes de la hora programada
    const reminderTime = new Date(scheduledTime.getTime() - 15 * 60 * 1000);

    // Si ya pasó la hora del recordatorio para hoy, no lo programamos
    if (reminderTime.getTime() <= now.getTime()) {
      return;
    }

    const secondsUntilReminder = Math.floor((reminderTime.getTime() - now.getTime()) / 1000);

    await Notifications.scheduleNotificationAsync({
      identifier: `pickup_reminder_${orderId}`,
      content: {
        title: '⏰ ¡Tu pedido casi está listo!',
        body: `Recordatorio: Tu retiro programado está pautado para las ${timeStr} hs. ¡Te esperamos!`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilReminder,
      },
    });

    console.log(`Notificación nativa agendada en ${secondsUntilReminder} segundos.`);
  } catch (err) {
    console.warn('Error al programar recordatorio de retiro nativo:', err.message);
  }
}

/**
 * Cancela el recordatorio de retiro de un pedido específico.
 * @param {string} orderId ID del pedido
 */
export async function cancelPickupReminder(orderId) {
  console.log(`[Cancelando Alerta Retiro] Pedido #${orderId}`);

  if (Platform.OS === 'web' || !Notifications) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(`pickup_reminder_${orderId}`);
  } catch (err) {
    console.warn('Error al cancelar recordatorio de retiro nativo:', err.message);
  }
}

/**
 * Programa un recordatorio de carrito abandonado para 30 minutos después.
 */
export async function scheduleCartAbandonmentReminder() {
  console.log('[Programando Alerta Carrito Abandonado] Se activará en 30 minutos.');

  if (Platform.OS === 'web' || !Notifications) return;
  
  try {
    // Cancelar cualquier recordatorio anterior de carrito abandonado para no duplicar
    await cancelCartAbandonmentReminder();

    await Notifications.scheduleNotificationAsync({
      identifier: 'cart_abandonment',
      content: {
        title: '🛒 ¿Con hambre? Dejaste productos en tu carrito',
        body: '¡Completá tu pedido antes de que se enfríe la parrilla! 🥩🔥',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 30 * 60, // 30 minutos (1800 segundos)
      },
    });
    console.log('Notificación nativa de carrito abandonado agendada.');
  } catch (err) {
    console.warn('Error al programar aviso de carrito abandonado nativo:', err.message);
  }
}

/**
 * Cancela el recordatorio de carrito abandonado.
 */
export async function cancelCartAbandonmentReminder() {
  console.log('[Cancelando Alerta Carrito Abandonado]');

  if (Platform.OS === 'web' || !Notifications) return;
  
  try {
    await Notifications.cancelScheduledNotificationAsync('cart_abandonment');
  } catch (err) {
    console.warn('Error al cancelar aviso de carrito abandonado nativo:', err.message);
  }
}
