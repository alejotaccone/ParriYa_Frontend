import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Modal, TextInput } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../components/Backoffice/backoffice.styles';
import { COLORS } from '../../constants/colors';

// --- SEED DE RESERVAS INICIALES (MOCKUP EXACTO) ---
const RESERVAS_SEED_DATA = [
  // Lunes 27 de Abril
  { id: '1', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Mediodia', cliente: 'Enzo Mussi', horario: '12:00', cantidad: 4, estado: 'Confirmada' },
  { id: '2', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Mediodia', cliente: 'Luis Diaz', horario: '12:30', cantidad: 6, estado: 'Confirmada' },
  { id: '3', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Mediodia', cliente: 'Luisa Jara', horario: '13:00', cantidad: 3, estado: 'Cancelada' },
  { id: '4', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Noche', cliente: 'Enzo Mussi', horario: '21:30', cantidad: 4, estado: 'Confirmada' },
  { id: '5', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Noche', cliente: 'Luis Diaz', horario: '20:30', cantidad: 6, estado: 'Confirmada' },
  { id: '6', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Noche', cliente: 'Luisa Jara', horario: '22:30', cantidad: 3, estado: 'Confirmada' },
  { id: '7', fecha: '27/04/2026', nombreDia: 'Lunes 27 de abril', diaSemana: 'Lunes', nroDia: '27', turno: 'Noche', cliente: 'Claudia Paz', horario: '22:30', cantidad: 3, estado: 'Confirmada' },

  // Martes 28 de Abril
  { id: '8', fecha: '28/04/2026', nombreDia: 'Martes 28 de abril', diaSemana: 'Martes', nroDia: '28', turno: 'Mediodia', cliente: 'Manuel Neuer', horario: '12:30', cantidad: 2, estado: 'Confirmada' },
  { id: '9', fecha: '28/04/2026', nombreDia: 'Martes 28 de abril', diaSemana: 'Martes', nroDia: '28', turno: 'Mediodia', cliente: 'Bruno Titos', horario: '13:15', cantidad: 4, estado: 'Confirmada' },
  { id: '10', fecha: '28/04/2026', nombreDia: 'Martes 28 de abril', diaSemana: 'Martes', nroDia: '28', turno: 'Noche', cliente: 'Luisa Jara', horario: '21:00', cantidad: 4, estado: 'Confirmada' },
  { id: '11', fecha: '28/04/2026', nombreDia: 'Martes 28 de abril', diaSemana: 'Martes', nroDia: '28', turno: 'Noche', cliente: 'Enzo Mussi', horario: '22:00', cantidad: 5, estado: 'Confirmada' },

  // Miercoles 29 de Abril
  { id: '12', fecha: '29/04/2026', nombreDia: 'Miercoles 29 de abril', diaSemana: 'Miercoles', nroDia: '29', turno: 'Mediodia', cliente: 'Claudia Paz', horario: '13:00', cantidad: 3, estado: 'Confirmada' },
  { id: '13', fecha: '29/04/2026', nombreDia: 'Miercoles 29 de abril', diaSemana: 'Miercoles', nroDia: '29', turno: 'Noche', cliente: 'Manuel Neuer', horario: '20:30', cantidad: 6, estado: 'Confirmada' },
  { id: '14', fecha: '29/04/2026', nombreDia: 'Miercoles 29 de abril', diaSemana: 'Miercoles', nroDia: '29', turno: 'Noche', cliente: 'Bruno Titos', horario: '22:30', cantidad: 2, estado: 'Cancelada' },
];

const DIAS_CAROUSEL = [
  { fecha: '27/04/2026', nro: '27', nombre: 'Lunes', fullText: 'Lunes 27 de abril' },
  { fecha: '28/04/2026', nro: '28', nombre: 'Martes', fullText: 'Martes 28 de abril' },
  { fecha: '29/04/2026', nro: '29', nombre: 'Mierc.', fullText: 'Miercoles 29 de abril' },
];

export default function BackofficeReservas() {
  const router = useRouter();
  const [selectedFecha, setSelectedFecha] = useState('27/04/2026');
  const [reservations, setReservations] = useState([]);
  
  // Estados para Modal de Agregar Reserva
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteInput, setClienteInput] = useState('');
  const [horarioInput, setHorarioInput] = useState('');
  const [cantidadInput, setCantidadInput] = useState('');
  const [turnoInput, setTurnoInput] = useState('Mediodia'); // Mediodia o Noche

  // Carga reservas de AsyncStorage y las siembra si no hay datos
  const loadReservations = async () => {
    try {
      const storedJson = await AsyncStorage.getItem('reservas');
      if (storedJson) {
        setReservations(JSON.parse(storedJson));
      } else {
        await AsyncStorage.setItem('reservas', JSON.stringify(RESERVAS_SEED_DATA));
        setReservations(RESERVAS_SEED_DATA);
      }
    } catch (e) {
      console.error('Error cargando reservas:', e);
      setReservations(RESERVAS_SEED_DATA);
    }
  };

  const navigation = useNavigation();

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

  // Función para alternar/cambiar el estado de una reserva (Confirmada <-> Cancelada) de forma rápida al tocarla
  const handleToggleReservaEstado = (reservaId) => {
    Alert.alert(
      'Gestionar Reserva',
      'Elige una acción para esta reserva:',
      [
        {
          text: 'Alternar Confirmada / Cancelada',
          onPress: async () => {
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
          },
        },
        {
          text: 'Eliminar Reserva',
          style: 'destructive',
          onPress: async () => {
            const updated = reservations.filter((r) => r.id !== reservaId);
            await AsyncStorage.setItem('reservas', JSON.stringify(updated));
            setReservations(updated);
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
      };

      const updated = [...reservations, newReserva];
      await AsyncStorage.setItem('reservas', JSON.stringify(updated));
      setReservations(updated);
      
      // Limpiar y cerrar
      setClienteInput('');
      setHorarioInput('');
      setCantidadInput('');
      setModalVisible(false);

      Alert.alert('Reserva guardada', `Se registró la reserva a nombre de "${clienteInput}".`);
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
              };
              const updated = [...reservations, newRes];
              await AsyncStorage.setItem('reservas', JSON.stringify(updated));
              setReservations(updated);
              Alert.alert('Simulación exitosa', 'Reserva simulada guardada.');
            } catch (e) {
              console.error(e);
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
