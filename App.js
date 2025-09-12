import { StatusBar } from 'expo-status-bar';
import 'intl-pluralrules';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import i18n from './src/assets/i18n';
import ErrorBoundary from './src/components/ErrorBoundary';
import SupportFloatingButton from './src/components/SupportFloatingButton';

// TEST: Verificar variables de entorno
import { EXPO_PUBLIC_BASE_URL } from '@env';
import { APP_CONFIG } from './src/config/env';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/core/context/CartContext';
import { LoyaltyProvider } from './src/core/context/LoyaltyContext';
import { NotificationProvider } from './src/core/context/NotificationContext';
import { UserProvider } from './src/core/context/UserContext';
import { WishlistProvider } from './src/core/context/WishlistContext';
import AppNavigator from './src/core/navigation/AppNavigator';
import { ClientConfigService } from './src/core/services/clientConfig.service';
import { supportConfigService } from './src/core/services/supportConfig.service';
console.log('🔧 [App.js] Testing environment variables...');
console.log('📱 [App.js] From @env - EXPO_PUBLIC_BASE_URL:', EXPO_PUBLIC_BASE_URL);
console.log('⚙️ [App.js] From APP_CONFIG - apiUrl:', APP_CONFIG.apiUrl);
console.log(
  '🌐 [App.js] Expected URL: https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api'
);

const clientConfigService = new ClientConfigService();

export default function App() {
  const [clientConfig, setClientConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DEBUG: Logging para diagnóstico
    console.log('🔧 App iniciando...');
    console.log('🌍 Environment:', process.env.NODE_ENV);

    // Cambia la URL por la de tu API si quieres cargar desde API
    const apiUrl = null; // Ejemplo: 'https://api.tuempresa.com/config'
    const loadConfig = async () => {
      try {
        console.log('📝 Cargando configuración...');
        let config;
        if (apiUrl) {
          config = await clientConfigService.loadConfigFromApi(apiUrl);
        } else {
          config = clientConfigService.loadLocalConfig();
        }
        console.log('✅ Configuración cargada:', config ? 'OK' : 'FAILED');
        setClientConfig(config);
      } catch (error) {
        console.error('❌ Error loading config:', error);
        // Fallback a configuración por defecto
        const fallbackConfig = clientConfigService.loadLocalConfig();
        console.log('🔄 Using fallback config:', fallbackConfig ? 'OK' : 'FAILED');
        setClientConfig(fallbackConfig);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Puedes pasar clientConfig por contexto o props a los módulos
  // El botón solo se muestra si el módulo 'support' está activo
  const plan = clientConfig?.settings?.plan || 'basic';
  const activeModules = clientConfig?.modules?.[plan] || [];
  const showSupport = activeModules.includes('support');

  const handleSupportOption = (option) => {
    if (option === 'ai') {
      alert('Agente IA: próximamente disponible');
    } else if (option === 'whatsapp') {
      const config = supportConfigService.getConfig();
      const number = config.whatsappNumber || '+573001234567';
      const url = `https://wa.me/${number.replace(/[^\d]/g, '')}`;
      Linking.openURL(url);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <I18nextProvider i18n={i18n}>
          <UserProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationProvider>
                    <LoyaltyProvider>
                      <AppNavigator clientConfig={clientConfig} />
                      <StatusBar style="auto" />
                    </LoyaltyProvider>
                  </NotificationProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </UserProvider>
        </I18nextProvider>
        <SupportFloatingButton visible={showSupport} onSelectOption={handleSupportOption} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
