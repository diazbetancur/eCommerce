import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine the correct base URL based on platform
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5134/api'; // OK en simulador iOS
    }

    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5134/api'; // CORRECTO para emulador Android
    }
  }

  // In production, use the actual API URL
  return process.env.API_URL;
};

const api = axios.create({
  baseURL: getBaseUrl()
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
