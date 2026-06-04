import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import api from '../../services/api';

const generateDaysCarousel = () => {
  const days = [];
  const names = ['Dom.', 'Lunes', 'Martes', 'Mierc.', 'Jueves', 'Viernes', 'Sab.'];
  const fullNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dayName = names[d.getDay()];
    const nroDia = String(d.getDate());
    
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const fecha = `${dd}/${mm}/${yyyy}`;

    const fullText = `${fullNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;

    days.push({
      fecha,
      nro: nroDia,
      nombre: dayName,
      fullText
    });
  }
  return days;
};

const DIAS_CAROUSEL = generateDaysCarousel();

const formatToBackendDate = (fechaStr) => {
  const parts = fechaStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return fechaStr;
};

const formatFromBackendDate = (fechaBackendStr) => {
  if (!fechaBackendStr) return '';
  const parts = fechaBackendStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return fechaBackendStr;
};

export default function BackofficeReservas() {
  const router = useRouter();
  
  const todayDd = String(new Date().getDate()).padStart(2, '0');
  const todayMm = String(new Date().getMonth() + 1).padStart(2, '0');
  const todayYyyy = new Date().getFullYear();
  const todayFormatted = `${todayDd}/${todayMm}/${todayYyyy}`;

  const [selectedFecha, setSelectedFecha] = useState(todayFormatted);
  const [reservations, setReservations] = useState([]);
  
  // Estados para Modal de Agregar Reserva
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteInput, setClienteInput] = useState('');
  const [horarioInput, setHorarioInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState('');
  const [turnoInput, setTurnoInput] = useState('Mediodia'); // Mediodia o Noche

  const loadReservations = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

      const backendDate = formatToBackendDate(selectedFecha);
      const response = await api.get(`/reservas/dia/${backendDate}`);
      
      const mapBackendReserva = (res, turnoName) => ({
        id: String(res.id),
        fecha: formatFromBackendDate(res.fechaDeReserva),
        turno: turnoName, // 'Mediodia' o 'Noche'
        cliente: res.nombreCliente,
        horario: (res.horarioDeReserva || '').substring(0, 5), // '12:30:00' -> '12:30'
        cantidad: res.cantidadDePersonas,
        estado: res.estado === 'CANCELADA' ? 'Cancelada' : 'Confirmada',
        telefono: res.telefonoCliente,
        ubicacion: res.ubicacion || 'ADENTRO',
      });

      const tardeMapped = (response.data.turnoTarde || []).map(r => mapBackendReserva(r, 'Mediodia'));
      const nocheMapped = (response.data.turnoNoche || []).map(r => mapBackendReserva(r, 'Noche'));
      
      setReservations([...tardeMapped, ...nocheMapped]);
    } catch (e) {
      console.warn('Error cargando reservas de backend:', e.message);
      setReservations([]);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    loadReservations();

    // Refresco automático de reservas cada 10 segundos
    const interval = setInterval(() => {
      loadReservations();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedFecha]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadReservations();
    });
    return unsubscribe;
  }, [navigation]);

  // Filtra las reservas del día seleccionado
  const reservasDelDia = reservations.filter((r) => r.fecha === selectedFecha);
  const reservasMediodia = reservasDelDia.filter((r) => r.turno === 'Mediodia');
  const reservasNoche = reservasDelDia.filter((r) => r.turno === 'Noche');

  // Cálculos dinámicos de sumatorias
  const totalReservasCount = reservasDelDia.length;
  const totalPersonasCount = reservasDelDia.reduce((sum, r) => sum + r.cantidad, 0);

  const currentDiaObj = DIAS_CAROUSEL.find((d) => d.fecha === selectedFecha) || DIAS_CAROUSEL[0];

  // Función para alternar/cambiar el estado de una reserva (Confirmada <-> Cancelada)
  const handleToggleReservaEstado = (reservaId) => {
    const selectedRes = reservations.find(r => r.id === reservaId);
    if (!selectedRes) return;

    Alert.alert(
      'Gestionar Reserva',
      'Elige una acción para esta reserva:',
      [
        {
          text: selectedRes.estado === 'Confirmada' ? 'Marcar como Cancelada' : 'Marcar como Confirmada',
          onPress: async () => {
            try {
              const newEstado = selectedRes.estado === 'Confirmada' ? 'CANCELADA' : 'CONFIRMADA';
              const body = {
                nombreCliente: selectedRes.cliente,
                telefonoCliente: selectedRes.telefono || '',
                cantidadDePersonas: selectedRes.cantidad,
                fechaDeReserva: formatToBackendDate(selectedRes.fecha),
                horarioDeReserva: selectedRes.horario.includes(':') ? (selectedRes.horario.length === 5 ? selectedRes.horario + ':00' : selectedRes.horario) : '12:00:00',
                ubicacion: selectedRes.ubicacion || 'ADENTRO',
                estado: newEstado
              };
              await api.put(`/reservas/${reservaId}`, body);
              Alert.alert('Reserva actualizada', `El estado cambió a "${newEstado === 'CONFIRMADA' ? 'Confirmada' : 'Cancelada'}".`);
              await loadReservations();
            } catch (err) {
              console.error('Error al actualizar reserva:', err.message);
              // Fallback local
              const updated = reservations.map((r) => {
                if (r.id === reservaId) {
                  return {
                    ...r,
                    estado: r.estado === 'Confirmada' ? 'Cancelada' : 'Confirmada',
                  };
                }
                return r;
              });
              await AsyncStorage.setItem('reservas', JSON.stringify(updated));
              setReservations(updated);
            }
          },
        },
        {
          text: 'Eliminar Reserva',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/reservas/${reservaId}`);
              Alert.alert('Eliminado', 'La reserva fue cancelada/eliminada.');
              await loadReservations();
            } catch (err) {
              console.error('Error al eliminar reserva:', err.message);
              // Fallback local
              const updated = reservations.filter((r) => r.id !== reservaId);
              await AsyncStorage.setItem('reservas', JSON.stringify(updated));
              setReservations(updated);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  // Función para guardar una nueva reserva desde el modal
  const handleSaveReservation = async () => {
    if (!clienteInput || !horarioInput || !cantidadInput) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    const cantidadNum = parseInt(cantidadInput, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      Alert.alert('Cantidad inválida', 'La cantidad de personas debe ser un número.');
      return;
    }

    try {
      const formattedTime = horarioInput.includes(':') ? (horarioInput.length === 5 ? horarioInput + ':00' : horarioInput) : '20:00:00';
      const body = {
        nombreCliente: clienteInput,
        telefonoCliente: '',
        cantidadDePersonas: cantidadNum,
        fechaDeReserva: formatToBackendDate(selectedFecha),
        horarioDeReserva: formattedTime,
        ubicacion: 'ADENTRO',
        estado: 'CONFIRMADA'
      };

      try {
        await api.post('/reservas', body);
        Alert.alert('Reserva guardada', `Se registró la reserva a nombre de "${clienteInput}".`);
        await loadReservations();
      } catch (backendErr) {
        console.warn('Fallo guardado en backend, guardando localmente:', backendErr.message);
        // Fallback local
        const newReserva = {
          id: Date.now().toString(),
          fecha: selectedFecha,
          nombreDia: currentDiaObj.fullText,
          diaSemana: currentDiaObj.nombre,
          nroDia: currentDiaObj.nro,
          turno: turnoInput,
          cliente: clienteInput,
          horario: horarioInput,
          cantidad: cantidadNum,
          estado: 'Confirmada',
          telefono: '',
          ubicacion: 'ADENTRO'
        };

        const updated = [...reservations, newReserva];
        await AsyncStorage.setItem('reservas', JSON.stringify(updated));
        setReservations(updated);
        Alert.alert('Reserva guardada localmente', `Se registró la reserva a nombre de "${clienteInput}".`);
      }
      
      // Limpiar y cerrar
      setClienteInput('');
      setHorarioInput('');
      setCantidadInput('');
      setModalVisible(false);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo registrar la reserva.');
    }
  };

  // Función para desloguear
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

  // Botón central de simulación
  const handleQuickAction = () => {
    Alert.alert(
      'Acciones del Administrador',
      'Simula operaciones para poblar la base de datos:',
      [
        {
          text: 'Simular nuevo Pedido',
          onPress: async () => {
            try {
              const currentOrdersJson = await AsyncStorage.getItem('orders');
              const currentOrders = currentOrdersJson ? JSON.parse(currentOrdersJson) : [];
              const nextId = currentOrders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
              const simulatedOrder = {
                id: nextId,
                usuario: 'Enzo Mussi',
                fecha_pedido: '02/06/2026',
                estado: 'Preparando',
                metodo_pago: 'Mercado Pago',
                total: 25000,
                tarifa_servicio: 3000,
                subtotal: 22000,
                cantidad_productos: 2,
                items: [{ producto_nombre: 'Lomo vacuno', cantidad: 1, subtotal: 20000 }],
              };
              await AsyncStorage.setItem('orders', JSON.stringify([simulatedOrder, ...currentOrders]));
              Alert.alert('Simulación exitosa', 'Pedido simulado guardado.');
            } catch (e) {
              console.error(e);
            }
          },
        },
        {
          text: 'Simular nueva Reserva',
          onPress: async () => {
            try {
              const body = {
                nombreCliente: 'Claudia Paz',
                telefonoCliente: '',
                cantidadDePersonas: 4,
                fechaDeReserva: formatToBackendDate(selectedFecha),
                horarioDeReserva: '21:30:00',
                ubicacion: 'ADENTRO',
                estado: 'CONFIRMADA'
              };
              await api.post('/reservas', body);
              await loadReservations();
              Alert.alert('Simulación exitosa', 'Reserva simulada guardada en backend.');
            } catch (e) {
              console.warn('Error al simular en backend, simulando localmente:', e.message);
              const newRes = {
                id: Date.now().toString(),
                fecha: selectedFecha,
                nombreDia: currentDiaObj.fullText,
                diaSemana: currentDiaObj.nombre,
                nroDia: currentDiaObj.nro,
                turno: 'Noche',
                cliente: 'Claudia Paz',
                horario: '21:30',
                cantidad: 4,
                estado: 'Confirmada',
                telefono: '',
                ubicacion: 'ADENTRO'
              };
              const updated = [...reservations, newRes];
              await AsyncStorage.setItem('reservas', JSON.stringify(updated));
              setReservations(updated);
              Alert.alert('Simulación exitosa', 'Reserva simulada guardada localmente.');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };


  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* --- HEADER ORANGE CON BOTÓN VOLVER --- */}
      <View style={styles.header}>
        <View style={styles.backHeaderRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.backHeaderTitle}>Reservas</Text>
        </View>
      </View>

      {/* --- CAROUSEL HORIZONTAL DE DÍAS (CALENDARIO) --- */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {DIAS_CAROUSEL.map((dia) => {
            const isActive = dia.fecha === selectedFecha;
            return (
              <TouchableOpacity
                key={dia.fecha}
                activeOpacity={0.8}
                style={[
                  styles.calendarDayCard,
                  isActive ? styles.calendarDayCardActive : styles.calendarDayCardInactive,
                ]}
                onPress={() => setSelectedFecha(dia.fecha)}
              >
                <Text
                  style={
                    isActive ? styles.calendarDayOfWeekTextActive : styles.calendarDayOfWeekTextInactive
                  }
                >
                  {dia.nombre}
                </Text>
                <Text
                  style={
                    isActive ? styles.calendarDayNumberTextActive : styles.calendarDayNumberTextInactive
                  }
                >
                  {dia.nro}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- FILA DE RESUMEN DIARIO --- */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryDateText}>{currentDiaObj.fullText}</Text>
        <Text style={styles.summaryStatsText}>
          {totalReservasCount} reservas - {totalPersonasCount} personas
        </Text>
      </View>

      {/* --- LISTADO DE TURNOS (MEDIODIA Y NOCHE) --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 15 }}
      >
        
        {/* --- TURNO MEDIODIA --- */}
        <View style={styles.shiftSection}>
          <Text style={styles.shiftTitle}>Mediodia</Text>
          
          <View style={styles.card}>
            {/* Cabecera Tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, styles.reservaColHorario]}>Horario</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColNombre]}>Reserva a nombre de</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColEstado]}>Estado</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColCantidad]}>Cantidad</Text>
            </View>

            {/* Filas */}
            {reservasMediodia.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#8E8E93', marginVertical: 10 }}>
                No hay reservas para este turno.
              </Text>
            ) : (
              reservasMediodia.map((item, index) => {
                const isLast = index === reservasMediodia.length - 1;
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={isLast ? styles.tableRowNoBorder : styles.tableRow}
                    activeOpacity={0.7}
                    onPress={() => handleToggleReservaEstado(item.id)}
                  >
                    <Text style={[styles.timeText, styles.reservaColHorario]}>{item.horario}</Text>
                    <Text style={[styles.clientNameText, styles.reservaColNombre]} numberOfLines={1}>{item.cliente}</Text>
                    <Text 
                      style={[
                        item.estado === 'Confirmada' ? styles.stateTextConfirmada : styles.stateTextCancelada,
                        styles.orderColEstado
                      ]}
                    >
                      {item.estado}
                    </Text>
                    <Text style={[styles.countText, styles.reservaColCantidad]}>{item.cantidad} pers.</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* --- TURNO NOCHE --- */}
        <View style={styles.shiftSection}>
          <Text style={styles.shiftTitle}>Noche</Text>
          
          <View style={styles.card}>
            {/* Cabecera Tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, styles.reservaColHorario]}>Horario</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColNombre]}>Reserva a nombre de</Text>
              <Text style={[styles.tableHeaderCol, styles.orderColEstado]}>Estado</Text>
              <Text style={[styles.tableHeaderCol, styles.reservaColCantidad]}>Cantidad</Text>
            </View>

            {/* Filas */}
            {reservasNoche.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#8E8E93', marginVertical: 10 }}>
                No hay reservas para este turno.
              </Text>
            ) : (
              reservasNoche.map((item, index) => {
                const isLast = index === reservasNoche.length - 1;
                return (
                  <TouchableOpacity 
                    key={item.id} 
                    style={isLast ? styles.tableRowNoBorder : styles.tableRow}
                    activeOpacity={0.7}
                    onPress={() => handleToggleReservaEstado(item.id)}
                  >
                    <Text style={[styles.timeText, styles.reservaColHorario]}>{item.horario}</Text>
                    <Text style={[styles.clientNameText, styles.reservaColNombre]} numberOfLines={1}>{item.cliente}</Text>
                    <Text 
                      style={[
                        item.estado === 'Confirmada' ? styles.stateTextConfirmada : styles.stateTextCancelada,
                        styles.orderColEstado
                      ]}
                    >
                      {item.estado}
                    </Text>
                    <Text style={[styles.countText, styles.reservaColCantidad]}>{item.cantidad} pers.</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* --- BOTÓN ACCION ADICIONAR RESERVA --- */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity 
            style={styles.largeOrangeButton}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.largeOrangeButtonText}>Agregar/Modificar reservas</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* --- CUSTOM POPUP MODAL (AGREGAR RESERVA) --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Reserva</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Fecha: {currentDiaObj.fullText}</Text>

            {/* Input: Nombre Cliente */}
            <View style={styles.addModalInputWrapper}>
              <Text style={styles.addModalInputLabel}>Nombre del Cliente</Text>
              <TextInput
                style={styles.addModalTextInput}
                placeholder="Ej: Manuel Neuer"
                placeholderTextColor="#8E8E93"
                value={clienteInput}
                onChangeText={setClienteInput}
              />
            </View>

            {/* Input: Horario */}
            <View style={styles.addModalInputWrapper}>
              <Text style={styles.addModalInputLabel}>Horario (Ej: 13:00 o 21:30)</Text>
              <TextInput
                style={styles.addModalTextInput}
                placeholder="21:30"
                placeholderTextColor="#8E8E93"
                value={horarioInput}
                onChangeText={setHorarioInput}
              />
            </View>

            {/* Input: Cantidad de personas */}
            <View style={styles.addModalInputWrapper}>
              <Text style={styles.addModalInputLabel}>Cantidad de Personas</Text>
              <TextInput
                style={styles.addModalTextInput}
                placeholder="4"
                placeholderTextColor="#8E8E93"
                keyboardType="numeric"
                value={cantidadInput}
                onChangeText={setCantidadInput}
              />
            </View>

            {/* Selector de Turno */}
            <View style={styles.addModalInputWrapper}>
              <Text style={styles.addModalInputLabel}>Turno</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <TouchableOpacity
                  style={[
                    styles.statusOptionButton,
                    { flex: 0.48, marginVertical: 0 },
                    turnoInput === 'Mediodia' ? styles.statusBtnActivePreparando : styles.statusBtnInactive
                  ]}
                  onPress={() => setTurnoInput('Mediodia')}
                >
                  <Text style={[styles.statusBtnText, turnoInput === 'Mediodia' && styles.statusBtnTextActivePreparando, { marginLeft: 0, textAlign: 'center', width: '100%' }]}>
                    Mediodía
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusOptionButton,
                    { flex: 0.48, marginVertical: 0 },
                    turnoInput === 'Noche' ? styles.statusBtnActivePreparando : styles.statusBtnInactive
                  ]}
                  onPress={() => setTurnoInput('Noche')}
                >
                  <Text style={[styles.statusBtnText, turnoInput === 'Noche' && styles.statusBtnTextActivePreparando, { marginLeft: 0, textAlign: 'center', width: '100%' }]}>
                    Noche
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón de Confirmación final */}
            <TouchableOpacity
              style={styles.modalConfirmButton}
              activeOpacity={0.8}
              onPress={handleSaveReservation}
            >
              <Text style={styles.modalConfirmButtonText}>Guardar Reserva</Text>
            </TouchableOpacity>

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
          onPress={() => router.push('/backoffice/productos')}
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
