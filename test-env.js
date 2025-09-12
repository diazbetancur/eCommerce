import { EXPO_PUBLIC_BASE_URL } from '@env';
import { APP_CONFIG } from './src/config/env';

console.log('🔧 Testing environment variables...');
console.log('📱 From @env - EXPO_PUBLIC_BASE_URL:', EXPO_PUBLIC_BASE_URL);
console.log('⚙️ From APP_CONFIG - apiUrl:', APP_CONFIG.apiUrl);
console.log(
  '🌐 Expected URL: https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api'
);

if (!EXPO_PUBLIC_BASE_URL) {
  console.error('❌ EXPO_PUBLIC_BASE_URL is undefined!');
} else if (
  EXPO_PUBLIC_BASE_URL !== 'https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api'
) {
  console.error('❌ EXPO_PUBLIC_BASE_URL has wrong value!');
} else {
  console.log('✅ EXPO_PUBLIC_BASE_URL is correct!');
}
