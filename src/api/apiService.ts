import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { APP_CONFIG } from '../config/env';

const getBaseUrl = () => {
  return APP_CONFIG.apiUrl;
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
