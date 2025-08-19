// Configuración centralizada de la app eCommerce
export const APP_CONFIG = {
  colors: {
    primary: '#FF0000', // Cambia por el color principal
    secondary: '#00FF00', // Cambia por el color secundario
    accent: '#0000FF' // Cambia por el color de acento
  },
  logo: require('../../assets/logo.png'),
  icon: require('../../assets/icon.png'),
  modules: {
    catalog: true,
    cart: true,
    loyalty: true,
    topup: false,
    support: true,
    personalization: true,
    user: true,
    integrations: false,
    analytics: false,
    extras: true
  },
  subscription: {
    plan: 'premium', // o "basic"
    expires: '2025-12-31'
  }
};
