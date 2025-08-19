// Configuración específica por cliente para eCommerce multiempresa
// Puedes cargar este archivo dinámicamente o modificarlo al clonar la app para cada cliente

export const CLIENT_CONFIG = {
  // Branding
  branding: {
    appName: 'Mi Tienda',
    logo: require('../../assets/logo.png'),
    favicon: require('../../assets/favicon.png'),
    appIcon: require('../../assets/app-icon.png')
  },

  // Tema (máximo 3 colores)
  theme: {
    primary: '#3B82F6', // Color principal
    secondary: '#10B981', // Color secundario
    accent: '#F59E0B' // Color de acento
  },

  // Módulos activos según suscripción
  modules: {
    basic: ['products', 'navigation', 'user'],
    premium: ['products', 'navigation', 'user', 'cart', 'loyalty', 'wallet', 'support'],
    enterprise: ['*'] // Todos los módulos
  },

  // Configuraciones específicas
  settings: {
    currency: 'USD',
    language: 'es',
    country: 'CO',
    allowGuestCheckout: true,
    requireLoginForBrowsing: false,
    supportFloatingButton: true // Permite habilitar/deshabilitar el botón de soporte
  }
};
