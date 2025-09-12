// Configuración centralizada de la app eCommerce
import { EXPO_PUBLIC_BASE_URL } from '@env';

export const APP_CONFIG = {
  colors: {
    primary: '#001950', // Cambia por el color principal
    secondary: '#00c8ff', // Cambia por el color secundario
    accent: '#787878' // Cambia por el color de acento
  },
  logo: require('../assets/images/logo.png'),
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
  apiUrl:
    EXPO_PUBLIC_BASE_URL ||
    'https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api' // Usa variable de entorno o fallback
};
