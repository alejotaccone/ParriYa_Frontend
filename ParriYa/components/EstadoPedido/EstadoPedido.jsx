import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './EstadoPedido.styles';

const STATE_MAPPING = {
  1: {
    label: 'Recibido',
    description: 'Hemos recibido tu pedido y pronto empezará la preparación',
    segments: 1,
  },
  2: {
    label: 'Preparando',
    description: 'La parrilla esta preparando tu pedido', // Coincide con tu diseño
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
      const storedOrdersJson = await AsyncStorage.getItem('orders');
      if (storedOrdersJson) {
        const orders = JSON.parse(storedOrdersJson);
        if (orders && orders.length > 0) {
          const latestOrder = orders[0];
          
          // Si el pedido tiene un horario de retiro guardado lo usamos, si no generamos uno estimado
          if (latestOrder.horario_retiro) {
            setEstimatedTime(latestOrder.horario_retiro);
          } else {
            setEstimatedTime(generateDynamicTime());
          }

          // Mapeamos el estado del pedido de la bdd/storage
          const orderState = latestOrder.estado ? latestOrder.estado.toLowerCase() : '';
          if (orderState === 'pendiente' || orderState === 'recibido') {
            setCurrentStep(1);
          } else if (orderState === 'preparando' || orderState === 'en preparación' || orderState === 'en preparacion') {
            setCurrentStep(2);
          } else if (orderState === 'listo' || orderState === 'listo para retirar') {
            setCurrentStep(3);
          } else if (orderState === 'finalizado' || orderState === 'entregado') {
            setCurrentStep(4);
          } else {
            // Si es un estado no reconocido, por defecto mostramos la preparación
            setCurrentStep(2);
          }
        } else {
          setCurrentStep(null);
        }
      } else {
        setCurrentStep(null);
      }
    } catch (error) {
      console.error('Error al cargar el estado del pedido:', error);
      setCurrentStep(null);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect fuerza a que cada vez que el Cliente vuelve a enfocar la pantalla principal (Home),
  // se vuelva a disparar la lectura de la base de datos para ver si el admin actualizó el estado.
  useFocusEffect(
    useCallback(() => {
      fetchLatestOrder();
    }, [])
  );

  // Si está cargando o no hay pedidos activos, no renderizamos nada
  if (loading || currentStep === null) {
    return null;
  }

  const activeState = STATE_MAPPING[currentStep] || STATE_MAPPING[2];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ESTADO DEL PEDIDO</Text>

      <View style={styles.card}>
        <Text style={styles.restaurantText}>Parrilla "Los Pibes"</Text>
        
        <Text style={styles.estimatedTimeText}>
          Horario estimado: {estimatedTime}
        </Text>

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
      </View>
    </View>
  );
};

export default EstadoPedido;
