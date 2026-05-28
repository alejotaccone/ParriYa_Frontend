export const COLORS = {
  // Colores principales de ParriYa!
  primary: '#E76F41',       
  secondary: '#4B2610',     
  
  // Fondos
  backgroundLight: '#FFFFFF', 
  backgroundDark: '#1E1E1E',  
  backgroundGray: '#F5F5F5',  
  
  // Textos
  textMain: '#333333',      
  textMuted: '#8E8E93',   

  dropdownDark: '#04332D',    // Verde oscuro (Fondo del selector de variantes)
  textSecondary: '#777777',   // Gris intermedio (Subtítulos y etiquetas de precio)
  textDescription: '#555555', // Gris más oscuro (Para párrafos largos de descripción)
  
  // Líneas y bordes
  borderLight: '#F0F0F0',   
  borderMedium: '#E5E5EA',  
  
  // Específicos de los métodos de pago
  efectivo: '#3D8C1A',      
  mercadoPago: '#009EE3',   
  iconoTarjeta: '#FF5A2D',  

  // Sumalos adentro de export const COLORS = { ... }
  primaryDark: '#C84B22',   // Naranja más rojizo (Fondo del Banner)
  primaryLight: '#FAD3C3',  // Naranja re clarito (Texto secundario del Banner)
  highlight: '#FFE2B7',     // Amarillito (Texto destacado y puntito activo del Banner)
};

// Medidas y configuraciones visuales globales (opcional, pero re útil)
export const SIZES = {
  paddingGlobal: 25,        
  radiusCard: 15,           
  radiusPantalla: 35,       
};
export const FONTS = {
  h1: 32,         // Título gigante (Ej: "Parri-Ya!" en el Header)
  h2: 26,         // Títulos muy grandes (Ej: El Total a pagar abajo de todo)
  h3: 22,         // Títulos de Header de pantalla (Ej: "Tu carrito", "Pago", "Historial")
  h4: 18,         // Títulos de secciones adentro de las pantallas y textos de botones naranjas
  bodyLarge: 16,  // Textos destacados (Ej: Dirección "Habana 3540", Inputs grandes)
  body: 15,       // Texto normal (Ej: Nombre de los productos, textos de inputs del perfil)
  small: 14,      // Textos un poco más chicos (Ej: Cantidades "x1", subtítulos grises)
  xSmall: 12,     // Textos muy chiquitos (Ej: Las etiquetas flotantes de los inputs, sugerencias)
  price: 28, // Un tamaño especial ultra grande para el precio del Detalle
};