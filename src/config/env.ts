import { EXPO_PUBLIC_API_BASE_URL, ENVIRONMENT } from '@env';

export const config = {
  apiUrl: EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api',
  environment: ENVIRONMENT ?? 'development'
};
