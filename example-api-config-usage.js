// Ejemplo de uso del ApiConfigService en App.js

import { useApiConfig } from './src/core/hooks/useApiConfig';

export default function App() {
  // Usando el nuevo hook de configuración con cache
  const { config, loading, error, refreshConfig, clearCache, cacheInfo } = useApiConfig(
    'https://back-ecommerce-e0efcdeke8a9g6gb.eastus-01.azurewebsites.net/api/config'
  );

  useEffect(() => {
    console.log('🔧 App iniciando...');
    console.log('📋 Config loading:', loading);
    console.log('❌ Config error:', error);
    console.log('💾 Cache info:', cacheInfo);

    if (config) {
      console.log('✅ Configuración cargada:', config);
    }
  }, [config, loading, error, cacheInfo]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Cargando configuración...</Text>
      </View>
    );
  }

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
                      <AppNavigator clientConfig={config} />
                      <StatusBar style="auto" />

                      {/* Botón de desarrollo para refrescar config */}
                      {__DEV__ && (
                        <TouchableOpacity style={styles.devButton} onPress={refreshConfig}>
                          <Text>🔄 Refresh Config</Text>
                        </TouchableOpacity>
                      )}
                    </LoyaltyProvider>
                  </NotificationProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </UserProvider>
        </I18nextProvider>
      </View>
    </ErrorBoundary>
  );
}
