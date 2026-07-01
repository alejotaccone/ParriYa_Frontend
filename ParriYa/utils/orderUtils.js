/**
 * Parsea el horario de retiro para enviar al backend en formato HH:mm:ss.
 * @param {'inmediato' | 'programado'} mode Modo de retiro
 * @param {string | null} time Slot seleccionado (ej: "22:00 - 22:15")
 * @returns {string} Formato HH:mm:ss
 */
export function formatHorarioRetiro(mode, time) {
  if (mode === 'programado' && time) {
    const startHour = time.split(' - ')[0];
    return `${startHour}:00`;
  }
  
  // 'inmediato': Hora actual + 30 minutos
  const now = new Date();
  const future = new Date(now.getTime() + 30 * 60 * 1000);
  const h = String(future.getHours()).padStart(2, '0');
  const m = String(future.getMinutes()).padStart(2, '0');
  return `${h}:${m}:00`;
}

/**
 * Construye el cuerpo del pedido para enviar al backend.
 * @param {array} cartItems Items del carrito
 * @param {number} total Total a pagar
 * @param {string} metodo Método de pago ('EFECTIVO' o 'MERCADO_PAGO')
 * @param {string} horario Horario de retiro (HH:mm:ss)
 * @returns {object} Cuerpo del pedido
 */
export function buildOrderBody(cartItems, total, metodo, horario) {
  return {
    horarioRetiro: horario,
    total,
    detalles: cartItems.map((item) => ({
      productoId: Number.parseInt(item.id, 10),
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    })),
    pagos: [{ metodo, monto: total }],
  };
}
