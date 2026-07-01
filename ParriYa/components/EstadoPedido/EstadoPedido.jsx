import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './EstadoPedido.styles';
import api from '../../services/api';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../../constants/colors';
import { registerForPushNotificationsAsync, sendLocalNotification, cancelPickupReminder } from '../../services/notifications';

const STATE_MAPPING = {
  1: {
    label: 'Recibido',
    description: 'Hemos recibido tu pedido y pronto empezará la preparación',
    segments: 1,
  },
  2: {
    label: 'Preparando',
    description: 'La parrilla esta preparando tu pedido',
    segments: 2,
  },
  3: {
    label: 'Listo para retirar',
    description: '¡Tu pedido está listo! Ya podés pasar a retirarlo',
    segments: 3,
  },
  4: {
    label: 'Finalizado',
    description: '¡Pedido entregado! ¡Muchas gracias por elegirnos!',
    segments: 4,
  },
};


function getStepFromOrderState(orderState) {
  if (orderState === 'pendiente' || orderState === 'recibido') return 1;
  if (orderState === 'preparando' || orderState === 'en preparación' || orderState === 'en preparacion') return 2;
  if (orderState === 'listo' || orderState === 'listo para retirar') return 3;
  // Estado no reconocido → por defecto mostramos "Preparando"
  return 2;
}


async function markOrderAsClosed(orderId) {
  const raw = await AsyncStorage.getItem('closedFeedbacks');
  const ids = raw ? JSON.parse(raw) : [];
  if (!ids.includes(orderId)) {
    ids.push(orderId);
    await AsyncStorage.setItem('closedFeedbacks', JSON.stringify(ids));
  }
}


function parseApiError(error, fallback = 'No se pudo enviar la reseña. Intenta de nuevo.') {
  if (!error.response?.data) return fallback;
  if (typeof error.response.data === 'string') return error.response.data;
  return error.response.data.error || error.response.data.message || fallback;
}


const EstadoPedido = () => {
  const [currentStep, setCurrentStep] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const { colors, isDarkMode } = useTheme();
  const previousStepRef = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Estados para reseña / feedback
  const [latestOrder, setLatestOrder] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Genera un horario estimado dinámico basado en la hora actual si no viene guardado
  const generateDynamicTime = () => {
    try {
      const now   = new Date();
      const start = new Date(now.getTime() + 15 * 60 * 1000); // +15 mins
      const end   = new Date(now.getTime() + 45 * 60 * 1000); // +45 mins

      const formatTime = (date) => {
        const hours   = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      return `${formatTime(start)} - ${formatTime(end)}`;
    } catch (e) {
      return '12:45 - 13:15';
    }
  };


  const fetchLatestOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setCurrentStep(null);
        setLatestOrder(null);
        return;
      }

      const response = await api.get('/pedidos/mis-pedidos');
      const orders   = response.data;

      if (!orders || orders.length === 0) {
        setCurrentStep(null);
        setLatestOrder(null);
        previousStepRef.current = null;
        return;
      }

      const latest     = orders[0];
      const orderState = latest.estado ? latest.estado.toLowerCase() : '';
      setLatestOrder(latest);

      let nextStep = null;

      // Determinación del paso de la orden
      if (orderState === 'cancelado') {
        nextStep = null;
      } else if (orderState === 'entregado' || orderState === 'finalizado') {
        if (latest.tieneFeedback) {
          nextStep = null;
        } else {
          const raw       = await AsyncStorage.getItem('closedFeedbacks');
          const closedIds = raw ? JSON.parse(raw) : [];
          if (closedIds.includes(latest.id)) {
            nextStep = null;
          } else {
            nextStep = 4;
          }
        }
      } else {
        nextStep = getStepFromOrderState(orderState);
      }

      // Si hay un paso de orden válido, actualizamos el horario estimado
      if (nextStep !== null) {
        const fullTime = latest.horarioRetiro || latest.horario_retiro;
        setEstimatedTime(fullTime ? String(fullTime).substring(0, 5) : generateDynamicTime());
      }

      // Verificar si hay cambio de estado para disparar notificación
      if (nextStep !== null && previousStepRef.current !== null && previousStepRef.current !== nextStep) {
        if (nextStep === 1) {
          sendLocalNotification('🥩 Pedido Recibido', 'Hemos recibido tu pedido. Pronto se empezará a preparar.');
        } else if (nextStep === 2) {
          sendLocalNotification('👨‍🍳 Pedido en Preparación', 'La parrilla ya está cocinando tu comida.');
        } else if (nextStep === 3) {
          sendLocalNotification('🔥 ¡Pedido Listo!', 'Tu pedido está listo. Ya podés pasar a retirarlo por el local.');
          cancelPickupReminder(latest.id); // Cancelamos recordatorio programado ya que se completó
        } else if (nextStep === 4) {
          sendLocalNotification('🙌 ¡Pedido Entregado!', '¡Muchas gracias por elegirnos! ¡Que disfrutes tu comida!');
        }
      }

      previousStepRef.current = nextStep;
      setCurrentStep(nextStep);
    } catch (error) {
      console.error('Error al cargar el estado del pedido:', error);
      setCurrentStep(null);
      setLatestOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLatestOrder();
      const interval = setInterval(fetchLatestOrder, 10000);
      return () => clearInterval(interval);
    }, [])
  );


  const handleDismiss = async () => {
    if (!latestOrder) return;
    try {
      await markOrderAsClosed(latestOrder.id);
      setCurrentStep(null);
    } catch (e) {
      console.error('Error al ocultar aviso de entrega:', e);
    }
  };


  const handleSubmitFeedback = async () => {
    if (!comentario.trim()) {
      showAlert('Escribe tu opinión', 'Por favor escribe tu opinión antes de enviar.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const requestBody = {
        pedidoId:    latestOrder.id,
        comentario:  comentario.trim(),
        calificacion: Number.parseFloat(calificacion),
      };

      await api.post('/feedback', requestBody);

      await markOrderAsClosed(latestOrder.id);

      showAlert('¡Muchas gracias!', 'Tu reseña ha sido enviada con éxito.');
      setShowFeedbackModal(false);
      setComentario('');
      setCalificacion(5);
      setCurrentStep(null);
    } catch (error) {
      console.error('Error al enviar reseña:', error);

      const errorMsg = parseApiError(error);

      // Si el backend indica que ya existe una reseña, cerramos el banner igualmente
      if (errorMsg.includes('Ya existe una reseña') || errorMsg.includes('feedback')) {
        try {
          await markOrderAsClosed(latestOrder.id);
          setCurrentStep(null);
        } catch (e) {
          console.error(e);
        }
      }

      showAlert('Error', errorMsg);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Si está cargando o no hay pedidos activos, no renderizamos nada
  if (loading || currentStep === null) return null;

  const activeState = STATE_MAPPING[currentStep] || STATE_MAPPING[2];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ESTADO DEL PEDIDO</Text>

      <View style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? colors.card : COLORS.primary,
          borderColor: isDarkMode ? colors.border : "transparent",
          borderWidth: isDarkMode ? 1 : 0,
        }
      ]}>
        <Text style={[styles.restaurantText, { color: isDarkMode ? colors.text : COLORS.dropdownDark }]}>
          Parrilla &quot;Los Pibes&quot;
        </Text>
        
        {currentStep !== 4 ? (
          <Text style={[styles.estimatedTimeText, { color: isDarkMode ? COLORS.primary : COLORS.backgroundLight }]}>
            Horario estimado: {estimatedTime}
          </Text>
        ) : (
          <Text style={[styles.estimatedTimeText, { color: isDarkMode ? COLORS.primary : COLORS.backgroundLight }]}>
            ¡Entregado!
          </Text>
        )}

        <View style={styles.progressBarContainer}>
          {[1, 2, 3, 4].map((step) => {
            const isActive = step <= activeState.segments;
            return (
              <View
                key={step}
                style={[
                  styles.segment,
                  isActive 
                    ? styles.activeSegment 
                    : [styles.inactiveSegment, { backgroundColor: isDarkMode ? colors.border : '#FFFFFF' }],
                ]}
              />
            );
          })}
        </View>

        <Text style={[styles.descriptionText, { color: isDarkMode ? colors.textMuted : COLORS.backgroundLight }]}>
          {activeState.description}
        </Text>

        {currentStep === 4 && (
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.reviewButton, { backgroundColor: colors.card }]} 
              activeOpacity={0.8}
              onPress={() => setShowFeedbackModal(true)}
            >
              <Ionicons name="star" size={18} color="#E76F41" />
              <Text style={[styles.reviewButtonText, { color: isDarkMode ? "#ffffff" : COLORS.primary }]}>Dejar reseña</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dismissButton} 
              activeOpacity={0.8}
              onPress={handleDismiss}
            >
              <Text style={styles.dismissButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* MODAL DE RESEÑA */}
      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalCard, 
            { 
              backgroundColor: colors.card, 
              borderColor: isDarkMode ? colors.border : "transparent",
              borderWidth: isDarkMode ? 1 : 0 
            }
          ]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Dejar una reseña</Text>

            {/* Selector de calificación (estrellas) */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Tu calificación</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  activeOpacity={0.7}
                  onPress={() => setCalificacion(star)}
                >
                  <Ionicons
                    name={star <= calificacion ? "star" : "star-outline"}
                    size={36}
                    color="#E76F41"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Campo de comentario */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>Tu opinión</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: colors.box, 
                  color: colors.text, 
                  borderColor: colors.border 
                }
              ]}
              placeholder="¿Qué te pareció la comida y la entrega?..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={4}
              value={comentario}
              onChangeText={setComentario}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.box }]}
                activeOpacity={0.8}
                disabled={submittingFeedback}
                onPress={() => setShowFeedbackModal(false)}
              >
                <Text style={[styles.modalCancelButtonText, { color: colors.textMuted }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                activeOpacity={0.8}
                disabled={submittingFeedback}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.modalSubmitButtonText}>
                  {submittingFeedback ? 'Enviando...' : 'Enviar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EstadoPedido;
