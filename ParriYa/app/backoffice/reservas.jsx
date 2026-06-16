import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../components/ThemeContext';
import api from '../../services/api';


const generateDaysCarousel = () => {
  const days = [];
  const names     = ['Dom.', 'Lunes', 'Martes', 'Mierc.', 'Jueves', 'Viernes', 'Sab.'];
  const fullNames  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const nroDia  = String(d.getDate());
    const dd      = String(d.getDate()).padStart(2, '0');
    const mm      = String(d.getMonth() + 1).padStart(2, '0');
    const fecha   = `${dd}/${mm}/${d.getFullYear()}`;
    const fullText = `${fullNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;

    days.push({ fecha, nro: nroDia, nombre: names[d.getDay()], fullText });
  }
  return days;
};

const DIAS_CAROUSEL = generateDaysCarousel();

const formatToBackendDate = (fechaStr) => {
  const parts = fechaStr.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return fechaStr;
};

const formatFromBackendDate = (fechaBackendStr) => {
  if (!fechaBackendStr) return '';
  const parts = fechaBackendStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return fechaBackendStr;
};


function getDayCardStyle(isActive, colors, isDarkMode) {
  if (isActive) return [styles.calendarDayCard, styles.calendarDayCardActive];
  return [
    styles.calendarDayCard,
    styles.calendarDayCardInactive,
    { backgroundColor: colors.card, borderColor: isDarkMode ? colors.border : 'transparent', borderWidth: isDarkMode ? 1 : 0 },
  ];
}

function getDayNameStyle(isActive, colors) {
  if (isActive) return styles.calendarDayOfWeekTextActive;
  return [styles.calendarDayOfWeekTextInactive, { color: colors.textMuted }];
}

function getDayNumberStyle(isActive, colors) {
  if (isActive) return styles.calendarDayNumberTextActive;
  return [styles.calendarDayNumberTextInactive, { color: colors.text }];
}


function getTurnoButtonStyle(isActive, colors, isDarkMode) {
  return [
    styles.statusOptionButton,
    { flex: 0.48, marginVertical: 0 },
    isActive
      ? styles.statusBtnActivePreparando
      : [styles.statusBtnInactive, isDarkMode && { borderColor: colors.border }],
  ];
}

function getTurnoTextStyle(isActive, colors, isDarkMode) {
  return [
    styles.statusBtnText,
    isDarkMode && { color: colors.textMuted },
    isActive && styles.statusBtnTextActivePreparando,
    { marginLeft: 0, textAlign: 'center', width: '100%' },
  ];
}


function ShiftTable({ title, reservas, colors, isDarkMode, onPressRow }) {
  return (
    <View style={styles.shiftSection}>
      <Text style={[styles.shiftTitle, { color: isDarkMode ? colors.textMuted : '#777777' }]}>
        {title}
      </Text>

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDarkMode ? colors.border : 'transparent',
          borderWidth: isDarkMode ? 1 : 0,
        }
      ]}>
        {/* Cabecera Tabla */}
        <View style={[styles.tableHeader, { borderBottomColor: isDarkMode ? colors.border : '#F0F0F0' }]}>
          <Text style={[styles.tableHeaderCol, styles.reservaColHorario, { color: colors.textMuted }]}>Horario</Text>
          <Text style={[styles.tableHeaderCol, styles.reservaColNombre,  { color: colors.textMuted }]}>Reserva a nombre de</Text>
          <Text style={[styles.tableHeaderCol, styles.orderColEstado,    { color: colors.textMuted }]}>Estado</Text>
          <Text style={[styles.tableHeaderCol, styles.reservaColCantidad,{ color: colors.textMuted }]}>Cantidad</Text>
        </View>

        {/* Filas */}
        {reservas.length === 0 ? (
          <Text style={[styles.reservaEmptyText, { color: colors.textMuted }]}>
            No hay reservas para este turno.
          </Text>
        ) : (
          reservas.map((item, index) => {
            const isLast       = index === reservas.length - 1;
            const rowStyle     = isLast ? styles.tableRowNoBorder : styles.tableRow;
            const borderColor  = !isLast ? { borderBottomColor: isDarkMode ? colors.border : '#F2F2F2' } : null;
            const estadoStyle  = item.estado === 'Confirmada' ? styles.stateTextConfirmada : styles.stateTextCancelada;

            return (
              <TouchableOpacity
                key={item.id}
                style={[rowStyle, borderColor]}
                activeOpacity={0.7}
                onPress={() => onPressRow(item.id)}
              >
                <Text style={[styles.timeText,       styles.reservaColHorario,  { color: colors.text }]}>{item.horario}</Text>
                <Text style={[styles.clientNameText, styles.reservaColNombre,   { color: colors.text }]} numberOfLines={1}>{item.cliente}</Text>
                <Text style={[estadoStyle,           styles.orderColEstado]}>{item.estado}</Text>
                <Text style={[styles.countText,      styles.reservaColCantidad]}>{item.cantidad} pers.</Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}


export default function BackofficeReservas() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const todayDd        = String(new Date().getDate()).padStart(2, '0');
  const todayMm        = String(new Date().getMonth() + 1).padStart(2, '0');
  const todayFormatted = `${todayDd}/${todayMm}/${new Date().getFullYear()}`;

  const [selectedFecha, setSelectedFecha]   = useState(todayFormatted);
  const [reservations,  setReservations]    = useState([]);
  const [modalVisible,  setModalVisible]    = useState(false);
  const [clienteInput,  setClienteInput]    = useState('');
  const [horarioInput,  setHorarioInput]    = useState('');
  const [cantidadInput, setCantidadInput]   = useState('');
  const [turnoInput,    setTurnoInput]      = useState('Mediodia');

  const loadReservations = async () => {
    try {
      const activeUserJson = await AsyncStorage.getItem('activeUser');
      if (!activeUserJson) return;
      const user = JSON.parse(activeUserJson);
      if (user.rol !== 'admin') return;

      const backendDate = formatToBackendDate(selectedFecha);
      const response    = await api.get(`/reservas/dia/${backendDate}`);

      const mapBackendReserva = (res, turnoName) => ({
        id:       String(res.id),
        fecha:    formatFromBackendDate(res.fechaDeReserva),
        turno:    turnoName,
        cliente:  res.nombreCliente,
        horario:  (res.horarioDeReserva || '').substring(0, 5),
        cantidad: res.cantidadDePersonas,
        estado:   res.estado === 'CANCELADA' ? 'Cancelada' : 'Confirmada',
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
    const interval = setInterval(loadReservations, 10000);
    return () => clearInterval(interval);
  }, [selectedFecha]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadReservations);
    return unsubscribe;
  }, [navigation]);


  const reservasDelDia    = reservations.filter((r) => r.fecha === selectedFecha);
  const reservasMediodia  = reservasDelDia.filter((r) => r.turno === 'Mediodia');
  const reservasNoche     = reservasDelDia.filter((r) => r.turno === 'Noche');
  const totalReservasCount = reservasDelDia.length;
  const totalPersonasCount = reservasDelDia.reduce((sum, r) => sum + r.cantidad, 0);
  const currentDiaObj     = DIAS_CAROUSEL.find((d) => d.fecha === selectedFecha) || DIAS_CAROUSEL[0];


  const updateReservaStatus = async (reservaId) => {
    const selectedRes = reservations.find(r => r.id === reservaId);
    if (!selectedRes) return;

    try {
      const newEstado = selectedRes.estado === 'Confirmada' ? 'CANCELADA' : 'CONFIRMADA';
      const body = {
        nombreCliente:      selectedRes.cliente,
        telefonoCliente:    selectedRes.telefono || '',
        cantidadDePersonas: selectedRes.cantidad,
        fechaDeReserva:     formatToBackendDate(selectedRes.fecha),
        horarioDeReserva:   selectedRes.horario.includes(':')
          ? (selectedRes.horario.length === 5 ? `${selectedRes.horario}:00` : selectedRes.horario)
          : '12:00:00',
        ubicacion: selectedRes.ubicacion || 'ADENTRO',
        estado:    newEstado,
      };

      await api.put(`/reservas/${reservaId}`, body);
      Alert.alert('Reserva actualizada', `El estado cambió a "${newEstado === 'CONFIRMADA' ? 'Confirmada' : 'Cancelada'}".`);
      await loadReservations();
    } catch (err) {
      console.error('Error al actualizar reserva:', err.message);
      // Fallback local
      const updated = reservations.map((r) =>
        r.id === reservaId ? { ...r, estado: r.estado === 'Confirmada' ? 'Cancelada' : 'Confirmada' } : r
      );
      await AsyncStorage.setItem('reservas', JSON.stringify(updated));
      setReservations(updated);
    }
  };

  const deleteReserva = async (reservaId) => {
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
  };


  const handleToggleReservaEstado = (reservaId) => {
    const selectedRes = reservations.find(r => r.id === reservaId);
    if (!selectedRes) return;

    const toggleLabel = selectedRes.estado === 'Confirmada'
      ? 'Marcar como Cancelada'
      : 'Marcar como Confirmada';

    Alert.alert(
      'Gestionar Reserva',
      'Elige una acción para esta reserva:',
      [
        { text: toggleLabel,      onPress: () => updateReservaStatus(reservaId) },
        { text: 'Eliminar Reserva', style: 'destructive', onPress: () => deleteReserva(reservaId) },
        { text: 'Cancelar',        style: 'cancel' },
      ]
    );
  };


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
      const formattedTime = horarioInput.includes(':')
        ? (horarioInput.length === 5 ? `${horarioInput}:00` : horarioInput)
        : '20:00:00';

      const body = {
        nombreCliente:      clienteInput,
        telefonoCliente:    '',
        cantidadDePersonas: cantidadNum,
        fechaDeReserva:     formatToBackendDate(selectedFecha),
        horarioDeReserva:   formattedTime,
        ubicacion:          'ADENTRO',
        estado:             'CONFIRMADA',
      };

      try {
        await api.post('/reservas', body);
        Alert.alert('Reserva guardada', `Se registró la reserva a nombre de "${clienteInput}".`);
        await loadReservations();
      } catch (backendErr) {
        console.warn('Fallo guardado en backend, guardando localmente:', backendErr.message);
        const newReserva = {
          id:        Date.now().toString(),
          fecha:     selectedFecha,
          nombreDia: currentDiaObj.fullText,
          diaSemana: currentDiaObj.nombre,
          nroDia:    currentDiaObj.nro,
          turno:     turnoInput,
          cliente:   clienteInput,
          horario:   horarioInput,
          cantidad:  cantidadNum,
          estado:    'Confirmada',
          telefono:  '',
          ubicacion: 'ADENTRO',
        };
        const updated = [...reservations, newReserva];
        await AsyncStorage.setItem('reservas', JSON.stringify(updated));
        setReservations(updated);
        Alert.alert('Reserva guardada localmente', `Se registró la reserva a nombre de "${clienteInput}".`);
      }

      setClienteInput('');
      setHorarioInput('');
      setCantidadInput('');
      setModalVisible(false);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo registrar la reserva.');
    }
  };


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
                nombreCliente:      'Claudia Paz',
                telefonoCliente:    '',
                cantidadDePersonas: 4,
                fechaDeReserva:     formatToBackendDate(selectedFecha),
                horarioDeReserva:   '21:30:00',
                ubicacion:          'ADENTRO',
                estado:             'CONFIRMADA',
              };
              await api.post('/reservas', body);
              await loadReservations();
              Alert.alert('Simulación exitosa', 'Reserva simulada guardada en backend.');
            } catch (e) {
              console.warn('Error al simular en backend, simulando localmente:', e.message);
              const newRes = {
                id:        Date.now().toString(),
                fecha:     selectedFecha,
                nombreDia: currentDiaObj.fullText,
                diaSemana: currentDiaObj.nombre,
                nroDia:    currentDiaObj.nro,
                turno:     'Noche',
                cliente:   'Claudia Paz',
                horario:   '21:30',
                cantidad:  4,
                estado:    'Confirmada',
                telefono:  '',
                ubicacion: 'ADENTRO',
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
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- HEADER ORANGE CON BOTÓN VOLVER --- */}
      <View style={styles.header}>
        <View style={styles.backHeaderRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
                style={getDayCardStyle(isActive, colors, isDarkMode)}
                onPress={() => setSelectedFecha(dia.fecha)}
              >
                <Text style={getDayNameStyle(isActive, colors)}>{dia.nombre}</Text>
                <Text style={getDayNumberStyle(isActive, colors)}>{dia.nro}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- FILA DE RESUMEN DIARIO --- */}
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryDateText,  { color: colors.text }]}>{currentDiaObj.fullText}</Text>
        <Text style={[styles.summaryStatsText, { color: colors.textMuted }]}>
          {totalReservasCount} reservas - {totalPersonasCount} personas
        </Text>
      </View>

      {/* --- LISTADO DE TURNOS (usa ShiftTable para no repetir JSX) --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reservaScrollContent}
      >
        <ShiftTable
          title="Mediodia"
          reservas={reservasMediodia}
          colors={colors}
          isDarkMode={isDarkMode}
          onPressRow={handleToggleReservaEstado}
        />

        <ShiftTable
          title="Noche"
          reservas={reservasNoche}
          colors={colors}
          isDarkMode={isDarkMode}
          onPressRow={handleToggleReservaEstado}
        />

        {/* --- BOTÓN AGREGAR RESERVA --- */}
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
          <View style={[
            styles.modalCard,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? colors.border : 'transparent',
              borderWidth: isDarkMode ? 1 : 0,
            }
          ]}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Reserva</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>Fecha: {currentDiaObj.fullText}</Text>

            {/* Input: Nombre Cliente */}
            <View style={styles.addModalInputWrapper}>
              <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Nombre del Cliente</Text>
              <TextInput
                style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                placeholder="Ej: Manuel Neuer"
                placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                value={clienteInput}
                onChangeText={setClienteInput}
              />
            </View>

            {/* Input: Horario */}
            <View style={styles.addModalInputWrapper}>
              <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Horario (Ej: 13:00 o 21:30)</Text>
              <TextInput
                style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                placeholder="21:30"
                placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                value={horarioInput}
                onChangeText={setHorarioInput}
              />
            </View>

            {/* Input: Cantidad de personas */}
            <View style={styles.addModalInputWrapper}>
              <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Cantidad de Personas</Text>
              <TextInput
                style={[styles.addModalTextInput, { backgroundColor: isDarkMode ? colors.box : 'transparent', borderColor: isDarkMode ? colors.border : COLORS.borderMedium, color: colors.text }]}
                placeholder="4"
                placeholderTextColor={isDarkMode ? colors.textMuted : "#8E8E93"}
                keyboardType="numeric"
                value={cantidadInput}
                onChangeText={setCantidadInput}
              />
            </View>

            {/* Selector de Turno */}
            <View style={styles.addModalInputWrapper}>
              <Text style={[styles.addModalInputLabel, { color: colors.textMuted }]}>Turno</Text>
              <View style={styles.reservaShiftSelectorRow}>
                <TouchableOpacity
                  style={getTurnoButtonStyle(turnoInput === 'Mediodia', colors, isDarkMode)}
                  onPress={() => setTurnoInput('Mediodia')}
                >
                  <Text style={getTurnoTextStyle(turnoInput === 'Mediodia', colors, isDarkMode)}>
                    Mediodía
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={getTurnoButtonStyle(turnoInput === 'Noche', colors, isDarkMode)}
                  onPress={() => setTurnoInput('Noche')}
                >
                  <Text style={getTurnoTextStyle(turnoInput === 'Noche', colors, isDarkMode)}>
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
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/backoffice')}>
          <Ionicons name="home" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/backoffice/productos')}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/backoffice/perfil')}>
          <Ionicons name="person" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
