import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      errorLogin: 'User or password invalid',
      user: 'User',
      password: 'Password',
      errorUser: 'User is required',
      errorPassword: 'Password is required',
      btnLoggin: 'Login',
      tabHome: 'Home',
      tabAccount: 'Account',
      errorLogout: 'Error closing session',
      btnCloseSession: 'Log out',
      settings: 'Setting',
      Offer: 'Offer',
      Loyalty: 'Loyalty',
      cartShopping: 'Shopping'
    }
  },
  es: {
    translation: {
      errorLogin: 'Usuario o contraseña no son correctos',
      user: 'Usuario',
      password: 'Contraseña',
      errorUser: 'El usuario es obligatorio.',
      errorPassword: 'La contraseña es obligatoria.',
      btnLoggin: 'Iniciar Sesión',
      tabHome: 'Inicio',
      tabAccount: 'Cuenta',
      errorLogout: 'Error cerrando sesión',
      btnCloseSession: 'Cerrar Sesión',
      settings: 'Configuración',
      Offer: 'Ofertas',
      Loyalty: 'Lealtad',
      cartShopping: 'Carrito'
    }
  }
};

const initializeI18n = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('appLanguage');
    const initialLanguage = storedLanguage || Localization.locale.split('-')[0];

    await i18n.use(initReactI18next).init({
      fallbackLng: 'en',
      resources,
      lng: initialLanguage,
      interpolation: {
        escapeValue: false
      }
    });
  } catch (error) {
    console.error('Error initializing i18next:', error);
  }
};

initializeI18n();

export default i18n;
