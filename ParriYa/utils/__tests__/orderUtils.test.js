import { formatHorarioRetiro, buildOrderBody } from '../orderUtils';

describe('formatHorarioRetiro', () => {
  // Mockeamos la fecha para pruebas consistentes del modo inmediato
  beforeAll(() => {
    const mockDate = new Date('2026-07-01T15:00:00'); // 15:00:00
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('debería retornar el horario de inicio correcto en modo programado', () => {
    const slot = '21:30 - 21:45';
    const resultado = formatHorarioRetiro('programado', slot);
    expect(resultado).toBe('21:30:00');
  });

  it('debería retornar la hora actual + 30 minutos en modo inmediato', () => {
    // 15:00:00 + 30 min = 15:30:00
    const resultado = formatHorarioRetiro('inmediato', null);
    expect(resultado).toBe('15:30:00');
  });

  it('debería manejar cambios de hora correctamente (ej: sumando 30 min a las 15:45 da 16:15)', () => {
    const mockDate45 = new Date('2026-07-01T15:45:00');
    jest.setSystemTime(mockDate45);
    const resultado = formatHorarioRetiro('inmediato', null);
    expect(resultado).toBe('16:15:00');
  });
});

describe('buildOrderBody', () => {
  it('debería construir correctamente el cuerpo del pedido según los requerimientos del backend', () => {
    const cartItems = [
      { id: '10', nombre: 'Asado', precio: 15000, cantidad: 2 },
      { id: '12', nombre: 'Papas Fritas', precio: 5000, cantidad: 1 },
    ];
    const total = 35000;
    const metodo = 'MERCADO_PAGO';
    const horario = '21:00:00';

    const orderBody = buildOrderBody(cartItems, total, metodo, horario);

    expect(orderBody).toEqual({
      horarioRetiro: '21:00:00',
      total: 35000,
      detalles: [
        { productoId: 10, cantidad: 2, precioUnitario: 15000 },
        { productoId: 12, cantidad: 1, precioUnitario: 5000 },
      ],
      pagos: [
        { metodo: 'MERCADO_PAGO', monto: 35000 }
      ]
    });
  });
});
