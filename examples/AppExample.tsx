import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StoreConfigExample } from '../src/components/StoreConfigExample';
import { AppProviders } from '../src/core/providers/AppProviders';

// Configuración personalizada opcional
const customFallbackConfig = {
  business: {
    name: 'Mi Tienda eCommerce',
    contactEmail: 'contacto@mitienda.com'
  }
};

/**
 * Ejemplo de App principal con Context de configuración
 */
function App() {
  return (
    <AppProviders storeId="mi-tienda-123" fallbackConfig={customFallbackConfig}>
      <View style={styles.container}>
        <Text style={styles.title}>🏪 eCommerce App</Text>
        <StoreConfigExample />
      </View>
    </AppProviders>
  );
}

/**
 * Ejemplo de componente que usa los hooks de configuración
 */
function SimpleExample() {
  return (
    <AppProviders>
      <SimpleComponent />
    </AppProviders>
  );
}

function SimpleComponent() {
  const { useBranding, useCurrency, useModules } = require('./src/core/providers/AppProviders');
  const { branding } = useBranding();
  const { formatPrice } = useCurrency();
  const { isModuleEnabled } = useModules();

  return (
    <View style={[styles.container, { backgroundColor: branding.primaryColor + '10' }]}>
      <Text style={[styles.title, { color: branding.primaryColor }]}>Mi Tienda</Text>

      {isModuleEnabled('wishlist') && <Text style={styles.feature}>❤️ Wishlist disponible</Text>}

      <Text style={[styles.price, { color: branding.accentColor }]}>
        Precio especial: {formatPrice(29.99)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  feature: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center'
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10
  }
});

export default App;
export { SimpleExample };

/*
 * INSTRUCCIONES DE USO:
 *
 * 1. Reemplaza tu App.js principal con este código
 * 2. Configura las variables de entorno en .env:
 *    REACT_APP_CONFIG_API=https://tu-api.com/store/config
 *    REACT_APP_STORE_ID=tu-store-id
 *
 * 3. En cualquier componente, usa los hooks:
 *
 *    import { useBranding, useCurrency } from './core/providers/AppProviders';
 *
 *    function MiComponente() {
 *      const { branding } = useBranding();
 *      const { formatPrice } = useCurrency();
 *
 *      return (
 *        <View style={{ backgroundColor: branding.primaryColor }}>
 *          <Text>Precio: {formatPrice(19.99)}</Text>
 *        </View>
 *      );
 *    }
 *
 * 4. CSS Variables están disponibles automáticamente:
 *    --color-primary
 *    --color-secondary
 *    --color-accent
 *    --currency-symbol
 *    --currency-code
 *
 * 5. Para desarrollo, usa el StoreConfigExample component para debug
 */
