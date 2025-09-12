import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { APP_CONFIG } from '../config/env';

const getBaseUrl = () => {
  const url = APP_CONFIG.apiUrl;
  console.log('🌐 API Base URL:', url);
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000 // 10 segundos timeout
});

// Interceptor para logging de requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log('📤 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  });

  return config;
});

// Interceptor para logging de responses y errores
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
      dataLength: response.data ? JSON.stringify(response.data).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });

    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('🚫 Network Error - Checking connectivity to:', error.config?.baseURL);
    }

    return Promise.reject(error);
  }
);

export default api;
