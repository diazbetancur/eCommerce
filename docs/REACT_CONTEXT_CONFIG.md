# 🌟 React Context para Configuración Global de eCommerce

Sistema completo de configuración global usando React Query para fetching, caching y gestión de estado de configuración de tienda.

## 🚀 Características

✅ **React Query Integration**: Fetching, caching y sincronización automática  
✅ **CSS Variables**: Aplicación automática de colores de branding  
✅ **Estados de Loading**: Manejo apropiado de carga y errores  
✅ **Recarga Manual**: Función para refrescar configuración  
✅ **Valores por Defecto**: Configuración inicial mientras carga  
✅ **TypeScript**: Tipado completo y seguro  
✅ **Optimización**: useMemo para prevenir re-renders innecesarios  
✅ **Hooks Especializados**: Para branding, moneda, módulos, etc.  

## 📦 Estructura de Archivos

```
src/
├── core/
│   ├── context/
│   │   └── StoreConfigContext.tsx    # Context principal con React Query
│   ├── providers/
│   │   ├── QueryProvider.tsx         # Provider de React Query
│   │   └── AppProviders.tsx         # Provider combinado
│   └── services/
│       └── storeConfig.service.ts    # Servicio de datos
├── components/
│   └── StoreConfigExample.tsx        # Ejemplo de uso completo
└── examples/
    └── AppExample.tsx               # Ejemplo de integración en App
```

## 🛠️ Configuración Inicial

### 1. Instalación

```bash
npm install @tanstack/react-query
```

### 2. Variables de Entorno

```bash
# .env
REACT_APP_CONFIG_API=https://tu-api.com/api/v1/store/config
REACT_APP_STORE_ID=store_123
```

### 3. Integración en App Principal

```tsx
import React from 'react';
import { AppProviders } from './src/core/providers/AppProviders';
import { YourMainComponent } from './src/components/YourMainComponent';

function App() {
  return (
    <AppProviders storeId="mi-tienda-123">
      <YourMainComponent />
    </AppProviders>
  );
}

export default App;
```

## 📖 Uso de Hooks

### Hook Principal del Context

```tsx
import { useStoreConfigContext } from '../core/providers/AppProviders';

function MyComponent() {
  const { config, loading, error, refetch, isDefaultConfig } = useStoreConfigContext();
  
  if (loading) return <div>⏳ Cargando configuración...</div>;
  if (error) return <div>❌ Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{config.business.name}</h1>
      <p>Tipo: {isDefaultConfig ? 'Por defecto' : 'Del servidor'}</p>
      <button onClick={() => refetch()}>🔄 Actualizar</button>
    </div>
  );
}
```

### Hook de Branding

```tsx
import { useBranding } from '../core/providers/AppProviders';

function ThemedComponent() {
  const { branding, loading, error } = useBranding();
  
  if (loading) return <div>Cargando tema...</div>;
  
  return (
    <div style={{ 
      backgroundColor: branding.primaryColor,
      color: '#fff'
    }}>
      <h2>Componente con branding dinámico</h2>
    </div>
  );
}
```

### Hook de Moneda

```tsx
import { useCurrency } from '../core/providers/AppProviders';

function PriceComponent({ amount }) {
  const { formatPrice, formatCurrency, currency } = useCurrency();
  
  return (
    <div>
      <p>Precio simple: {formatPrice(amount)}</p>
      <p>Con código: {formatCurrency(amount, { showCode: true })}</p>
      <p>Solo número: {formatCurrency(amount, { showSymbol: false })}</p>
    </div>
  );
}
```

### Hook de Módulos

```tsx
import { useModules } from '../core/providers/AppProviders';

function ConditionalFeatures() {
  const { isModuleEnabled, modules } = useModules();
  
  return (
    <div>
      {isModuleEnabled('wishlist') && (
        <WishlistComponent />
      )}
      
      {isModuleEnabled('reviews') && (
        <ReviewsSection />
      )}
      
      <div>
        <h3>Módulos activos:</h3>
        {Object.entries(modules)
          .filter(([_, enabled]) => enabled)
          .map(([name, _]) => (
            <span key={name}>✅ {name} </span>
          ))
        }
      </div>
    </div>
  );
}
```

### Hook de Información del Negocio

```tsx
import { useBusiness } from '../core/providers/AppProviders';

function ContactInfo() {
  const { business } = useBusiness();
  
  return (
    <div>
      <h2>{business.name}</h2>
      <p>Email: {business.contactEmail}</p>
      {/* Otros campos del negocio */}
    </div>
  );
}
```

### Hook de Gestión de Cache

```tsx
import { useConfigCache } from '../core/providers/AppProviders';

function AdminPanel() {
  const { invalidateConfig, clearCache, refreshConfig } = useConfigCache();
  
  const handleClearCache = async () => {
    clearCache();
    console.log('Cache limpiado');
  };
  
  const handleRefresh = async () => {
    try {
      await refreshConfig();
      console.log('Configuración actualizada');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleRefresh}>🔄 Refrescar</button>
      <button onClick={handleClearCache}>🗑️ Limpiar Cache</button>
      <button onClick={invalidateConfig}>♻️ Invalidar Cache</button>
    </div>
  );
}
```

## 🎨 CSS Variables Automáticas

El Context aplica automáticamente CSS variables cuando se carga la configuración:

```css
/* Variables aplicadas automáticamente */
:root {
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #007bff;
  --color-primary-light: #333333;
  --color-primary-dark: #000000;
  --color-secondary-light: #999999;
  --color-secondary-dark: #333333;
  --currency-symbol: "$";
  --currency-code: "USD";
}
```

### Uso en CSS

```css
.my-button {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary-dark);
}

.price::before {
  content: var(--currency-symbol);
}
```

### Uso en Styled Components

```tsx
import styled from 'styled-components';

const ThemedButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary-dark);
  
  &:hover {
    background-color: var(--color-primary-light);
  }
`;
```

## ⚙️ Configuración Avanzada

### Provider con Configuración Personalizada

```tsx
import { AppProviders } from '../core/providers/AppProviders';

const customFallback = {
  business: {
    name: 'Mi Tienda Custom',
    contactEmail: 'custom@tienda.com'
  }
};

function App() {
  return (
    <AppProviders 
      storeId="custom-store" 
      fallbackConfig={customFallback}
    >
      <MainApp />
    </AppProviders>
  );
}
```

### React Query Personalizado

```tsx
import { QueryProvider } from '../core/providers/QueryProvider';
import { StoreConfigProvider } from '../core/context/StoreConfigContext';

function CustomApp() {
  return (
    <QueryProvider>
      <StoreConfigProvider storeId="my-store">
        <MyApp />
      </StoreConfigProvider>
    </QueryProvider>
  );
}
```

## 🔄 Flujo de Datos

```
1. App inicia → AppProviders → QueryProvider + StoreConfigProvider
2. StoreConfigProvider → useQuery(['storeConfig', storeId])
3. React Query → storeConfigService.getStoreConfig()
4. Service intenta: API → Cache → Mock → Default
5. Config obtenida → Aplicar CSS variables + Context value
6. Componentes → Hooks especializados → Datos actualizados
7. Background: React Query maneja refetch automático
```

## 🛡️ Manejo de Errores

### Estados de Error

```tsx
function ErrorHandlingExample() {
  const { config, loading, error, isDefaultConfig } = useStoreConfigContext();
  
  // Estado de carga
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Error pero con fallback
  if (error && isDefaultConfig) {
    return (
      <div>
        <Banner type="warning">
          Usando configuración por defecto. 
          Problema de conectividad detectado.
        </Banner>
        <MainContent config={config} />
      </div>
    );
  }
  
  // Error crítico sin fallback
  if (error && !config) {
    return <ErrorPage error={error} />;
  }
  
  // Estado normal
  return <MainContent config={config} />;
}
```

### Retry Automático

React Query maneja automáticamente:

- ✅ 3 reintentos con backoff exponencial
- ✅ Refetch automático en reconexión
- ✅ Background updates cada 30 minutos
- ✅ Cache por 10 minutos en caso de error

## 📊 Optimización de Performance

### Cache Strategy

```tsx
// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutos fresh
      gcTime: 1000 * 60 * 10,       // 10 minutos en cache
      retry: 3,                      // 3 reintentos
      refetchOnWindowFocus: false,   // No refetch en focus
    },
  },
});
```

### Memoización

```tsx
// El contextValue usa useMemo para prevenir re-renders
const contextValue = useMemo(() => ({
  config,
  loading: isLoading,
  error,
  refetch,
  isDefaultConfig
}), [config, isLoading, error, refetch, isDefaultConfig]);
```

## 🔮 Funcionalidades Futuras

- [ ] A/B Testing support
- [ ] Multi-store switching
- [ ] Real-time updates via WebSocket
- [ ] Offline-first strategy
- [ ] Configuration versioning
- [ ] Analytics integration

## 🧪 Testing

### Mock del Context

```tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockConfig = {
  storeId: 'test',
  branding: { primaryColor: '#ff0000' },
  // ... resto de config
};

function TestWrapper({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <StoreConfigProvider>
        {children}
      </StoreConfigProvider>
    </QueryClientProvider>
  );
}

test('component uses branding correctly', () => {
  render(<MyComponent />, { wrapper: TestWrapper });
  // ... assertions
});
```

---

¡Tu sistema de configuración global con React Query está listo! 🎉

**Ventajas principales:**
- 🚀 Performance óptimo con cache inteligente
- 🎨 CSS variables automáticas
- 🔄 Sincronización automática en background
- 🛡️ Manejo robusto de errores
- 📱 Hooks especializados para cada caso de uso
- ⚡ Optimizaciones de re-render con useMemo