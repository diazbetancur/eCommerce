// Configuración centralizada de la app eCommerce
export const APP_CONFIG = {
  colors: {
    primary: '#001950', // Cambia por el color principal
    secondary: '#00c8ff', // Cambia por el color secundario
    accent: '#787878' // Cambia por el color de acento
  },
  logo: require('../assets/images/logo.svg'),
  icon: require('../assets/app-icon.png'),
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
  },
  apiUrl: 'https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api' // <--- Modifica aquí la URL del servicio principal
};
