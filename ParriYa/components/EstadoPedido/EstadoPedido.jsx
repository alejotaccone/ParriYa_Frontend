import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './EstadoPedido.styles';
import api from '../../services/api';
import { useTheme } from '../ThemeContext';
import { COLORS } from '../../constants/colors';

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

const EstadoPedido = () => {
  const [currentStep, setCurrentStep] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const { colors, isDarkMode } = useTheme();
  
  // Estados para reseña / feedback
  const [latestOrder, setLatestOrder] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
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
      const now = new Date();
      const start = new Date(now.getTime() + 15 * 60 * 1000); // +15 mins
      const end = new Date(now.getTime() + 45 * 60 * 1000);   // +45 mins

      const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
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

      const userStr = await AsyncStorage.getItem('activeUser');
      if (userStr) {
        setActiveUser(JSON.parse(userStr));
      }

      const response = await api.get('/pedidos/mis-pedidos');
      const orders = response.data;

      if (orders && orders.length > 0) {
        const latest = orders[0];
        setLatestOrder(latest);
        const orderState = latest.estado ? latest.estado.toLowerCase() : '';

        // Ocultamos si el pedido está cancelado
        if (orderState === 'cancelado') {
          setCurrentStep(null);
          return;
        }

        // Si el pedido está entregado o finalizado, verificamos si el usuario ya cerró o calificó la orden
        if (orderState === 'entregado' || orderState === 'finalizado') {
          if (latest.tieneFeedback) {
            setCurrentStep(null);
            return;
          }

          const closedFeedbacks = await AsyncStorage.getItem('closedFeedbacks');
          const closedIds = closedFeedbacks ? JSON.parse(closedFeedbacks) : [];
          if (closedIds.includes(latest.id)) {
            setCurrentStep(null);
            return;
          }
          setCurrentStep(4);
          return;
        }

        // Si el pedido tiene un horario de retiro guardado lo usamos, si no generamos uno estimado
        if (latest.horarioRetiro || latest.horario_retiro) {
          const fullTime = latest.horarioRetiro || latest.horario_retiro;
          setEstimatedTime(String(fullTime).substring(0, 5));
        } else {
          setEstimatedTime(generateDynamicTime());
        }

        if (orderState === 'pendiente' || orderState === 'recibido') {
          setCurrentStep(1);
        } else if (orderState === 'preparando' || orderState === 'en preparación' || orderState === 'en preparacion') {
          setCurrentStep(2);
        } else if (orderState === 'listo' || orderState === 'listo para retirar') {
          setCurrentStep(3);
        } else {
          // Si es un estado no reconocido, por defecto mostramos la preparación
          setCurrentStep(2);
        }
      } else {
        setCurrentStep(null);
        setLatestOrder(null);
      }
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
      
      const interval = setInterval(() => {
        fetchLatestOrder();
      }, 10000);

      return () => clearInterval(interval);
    }, [])
  );

  const handleDismiss = async () => {
    if (!latestOrder) return;
    try {
      const closedFeedbacks = await AsyncStorage.getItem('closedFeedbacks');
      const closedIds = closedFeedbacks ? JSON.parse(closedFeedbacks) : [];
      if (!closedIds.includes(latestOrder.id)) {
        closedIds.push(latestOrder.id);
        await AsyncStorage.setItem('closedFeedbacks', JSON.stringify(closedIds));
      }
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
        pedidoId: latestOrder.id,
        comentario: comentario.trim(),
        calificacion: parseFloat(calificacion)
      };

      await api.post('/feedback', requestBody);

      // Guardamos el pedido en closedFeedbacks para que ya no vuelva a aparecer el banner
      const closedFeedbacks = await AsyncStorage.getItem('closedFeedbacks');
      const closedIds = closedFeedbacks ? JSON.parse(closedFeedbacks) : [];
      if (!closedIds.includes(latestOrder.id)) {
        closedIds.push(latestOrder.id);
        await AsyncStorage.setItem('closedFeedbacks', JSON.stringify(closedIds));
      }

      showAlert('¡Muchas gracias!', 'Tu reseña ha sido enviada con éxito.');
      setShowFeedbackModal(false);
      setComentario('');
      setCalificacion(5);
      setCurrentStep(null); // Ocultar barra del home
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      
      let errorMsg = 'No se pudo enviar la reseña. Intenta de nuevo.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else {
          errorMsg = error.response.data.error || error.response.data.message || errorMsg;
        }
      }

      // Si el backend indica que ya existe una reseña, guardamos en closedFeedbacks para ocultar el banner
      if (errorMsg.includes('Ya existe una reseña') || errorMsg.includes('feedback')) {
        try {
          const closedFeedbacks = await AsyncStorage.getItem('closedFeedbacks');
          const closedIds = closedFeedbacks ? JSON.parse(closedFeedbacks) : [];
          if (!closedIds.includes(latestOrder.id)) {
            closedIds.push(latestOrder.id);
            await AsyncStorage.setItem('closedFeedbacks', JSON.stringify(closedIds));
          }
          setCurrentStep(null); // Ocultar banner
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
  if (loading || currentStep === null) {
    return null;
  }

  const activeState = STATE_MAPPING[currentStep] || STATE_MAPPING[2];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ESTADO DEL PEDIDO</Text>

      <View style={styles.card}>
        <Text style={styles.restaurantText}>Parrilla &quot;Los Pibes&quot;</Text>
        
        {currentStep !== 4 ? (
          <Text style={styles.estimatedTimeText}>
            Horario estimado: {estimatedTime}
          </Text>
        ) : (
          <Text style={styles.estimatedTimeText}>
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
                  isActive ? styles.activeSegment : styles.inactiveSegment,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.descriptionText}>
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
