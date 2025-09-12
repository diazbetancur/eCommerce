# 🏪 Sistema de Configuración de Tienda

Este módulo proporciona un sistema completo para gestionar la configuración de una tienda eCommerce con cache automático, fallbacks y soporte para múltiples tiendas.

## 🚀 Características

- ✅ **Cache automático**: 24 horas de cache en localStorage
- ✅ **Fallbacks inteligentes**: API → Cache → Mock → Default
- ✅ **TypeScript completo**: Interfaces y tipos definidos
- ✅ **React Hooks**: Integración fácil con componentes
- ✅ **Colores dinámicos**: Branding personalizable por tienda
- ✅ **Configuración de módulos**: Habilitar/deshabilitar funcionalidades
- ✅ **Multi-moneda**: Formateo automático de precios
- ✅ **Debug panel**: Herramientas de desarrollo
- ✅ **Manejo de errores**: Logging y recuperación automática

## 📦 Estructura de Archivos

```
src/
├── core/
│   ├── services/
│   │   └── storeConfig.service.ts    # Servicio principal de configuración
│   └── hooks/
│       ├── useStoreConfig.ts         # Hooks para usar configuración
│       └── useColors.ts              # Hook para colores dinámicos
└── components/
    ├── ConfigDebugPanel.tsx          # Panel de debug para desarrollo
    └── ExampleConfigUsage.tsx        # Ejemplo de uso completo
```

## 🛠️ Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` con:

```bash
# URL del endpoint de configuración
REACT_APP_CONFIG_API=https://tu-api.com/api/v1/store/config

# ID único de tu tienda
REACT_APP_STORE_ID=store_123
```

### 2. Formato de Respuesta API

Tu API debe devolver:

```json
{
  "success": true,
  "data": {
    "storeId": "store_123",
    "business": {
      "name": "Mi Tienda",
      "description": "La mejor tienda online",
      "address": "Calle Principal 123",
      "phone": "+1234567890",
      "email": "contacto@mitienda.com"
    },
    "branding": {
      "primaryColor": "#3B82F6",
      "secondaryColor": "#F59E0B", 
      "accentColor": "#8B5CF6",
      "logoUrl": "https://tu-cdn.com/logo.png"
    },
    "currency": {
      "code": "USD",
      "symbol": "$",
      "decimalPlaces": 2
    },
    "modules": {
      "offers": true,
      "loyalty": true,
      "reviews": false,
      "wishlist": true
    }
  }
}
```

## 📖 Uso Básico

### Hook Principal

```tsx
import { useStoreConfig } from '../core/hooks/useStoreConfig';

function MyComponent() {
  const { config, loading, error, refreshConfig } = useStoreConfig();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{config?.business.name}</h1>
      <p>{config?.business.description}</p>
      <button onClick={refreshConfig}>Actualizar</button>
    </div>
  );
}
```

### Colores Dinámicos

```tsx
import { useColors } from '../core/hooks/useColors';

function ThemedComponent() {
  const { colors, hasBranding } = useColors();

  return (
    <View style={{ backgroundColor: colors.PRIMARY }}>
      <Text style={{ color: colors.WHITE }}>
        {hasBranding ? 'Branding personalizado' : 'Colores por defecto'}
      </Text>
    </View>
  );
}
```

### Formateo de Moneda

```tsx
import { useStoreCurrency } from '../core/hooks/useStoreConfig';

function PriceComponent({ amount }) {
  const { formatPrice } = useStoreCurrency();

  return <Text>{formatPrice(amount)}</Text>; // Resultado: $19.99
}
```

### Módulos Habilitados

```tsx
import { useStoreModules } from '../core/hooks/useStoreConfig';

function OffersSection() {
  const { isModuleEnabled } = useStoreModules();

  if (!isModuleEnabled('offers')) {
    return null; // No mostrar ofertas si el módulo está deshabilitado
  }

  return <OffersComponent />;
}
```

## 🎨 Estilos Dinámicos

### Uso del Hook de Tema

```tsx
import { useTheme } from '../core/hooks/useColors';

function StyledComponent() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.SURFACE,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.PRIMARY,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título con estilo dinámico</Text>
    </View>
  );
}
```

## 🔧 Herramientas de Desarrollo

### Panel de Debug

```tsx
import { ConfigDebugPanel } from '../components/ConfigDebugPanel';

function App() {
  const [showDebug, setShowDebug] = useState(__DEV__);

  return (
    <View>
      {/* Tu app */}
      
      {/* Panel de debug solo en desarrollo */}
      {showDebug && <ConfigDebugPanel />}
    </View>
  );
}
```

### Estado de Configuración

```tsx
import { ConfigStatus } from '../components/ConfigDebugPanel';

function Header() {
  return (
    <View>
      <ConfigStatus /> {/* Muestra el estado actual */}
    </View>
  );
}
```

## 📱 Funcionalidades Avanzadas

### Cache Manual

```tsx
import { storeConfigService } from '../core/services/storeConfig.service';

// Limpiar cache manualmente
storeConfigService.clearCache();

// Verificar estado del cache
const cacheStatus = storeConfigService.getCacheStatus();
console.log(cacheStatus);

// Forzar refresh desde API
const config = await storeConfigService.getStoreConfig(true);
```

### Manejo de Errores

El sistema tiene múltiples niveles de fallback:

1. **API primaria**: Intenta obtener configuración del servidor
2. **Cache local**: Si la API falla, usa cache si es válido
3. **Mock data**: Si no hay cache, usa datos de ejemplo
4. **Configuración por defecto**: Como último recurso

### Logging y Debug

El sistema registra automáticamente:

- ✅ Éxito al cargar configuración
- ❌ Errores de API
- 💾 Estado del cache
- 🔄 Operaciones de refresh
- ⏰ Información de timing

## 🚀 Integración en Producción

### 1. Configuración de Variables

```bash
# Producción
REACT_APP_CONFIG_API=https://api.produccion.com/store/config
REACT_APP_STORE_ID=store_prod_123

# Staging
REACT_APP_CONFIG_API=https://api.staging.com/store/config
REACT_APP_STORE_ID=store_stage_123
```

### 2. Configuración EAS

En tu `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "REACT_APP_CONFIG_API": "https://api.produccion.com/store/config",
        "REACT_APP_STORE_ID": "store_prod_123"
      }
    }
  }
}
```

### 3. Monitoreo

```tsx
// Agregar en tu app principal
useEffect(() => {
  const { config, error } = useStoreConfig();
  
  if (error) {
    // Enviar error a tu servicio de monitoreo
    console.error('Config Error:', error);
    // Analytics.track('config_error', { error });
  }
}, []);
```

## 🔄 Flujo de Datos

```
1. App inicia → useStoreConfig()
2. Verifica cache → ¿Es válido?
   ├─ SÍ → Usa cache + verifica API en background
   └─ NO → Llama a API
3. API responde
   ├─ ✅ Éxito → Guarda en cache → Actualiza UI
   └─ ❌ Error → Intenta cache → Mock → Default
4. UI se actualiza con configuración final
```

## 🛡️ Manejo de Errores

### Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|--------|----------|
| `API_ERROR` | Servidor no responde | Verifica URL y conexión |
| `INVALID_STORE_ID` | ID de tienda incorrecto | Verifica variables de entorno |
| `CACHE_EXPIRED` | Cache expirado sin API | Se usarán datos por defecto |
| `NETWORK_ERROR` | Sin conexión | Funciona offline con cache |

### Estrategia de Recuperación

1. **Retry automático**: 3 intentos con backoff exponencial
2. **Fallback inteligente**: Cache → Mock → Default
3. **Notificación al usuario**: Solo en errores críticos
4. **Logging completo**: Para debugging en desarrollo

## 📈 Rendimiento

- ⚡ **Cache hit**: ~1ms (lectura de localStorage)
- 🌐 **API call**: ~100-500ms (primera vez)
- 📱 **Background refresh**: No bloquea UI
- 💾 **Tamaño cache**: ~2-5KB por configuración

## 🔮 Próximas Mejoras

- [ ] Cache con TTL configurable
- [ ] Soporte para configuración por usuario
- [ ] Sincronización automática
- [ ] Configuración A/B testing
- [ ] Validación de esquema con Zod
- [ ] Offline-first con service workers

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Actualiza la interfaz `StoreConfig` en `storeConfig.service.ts`
2. Agrega nuevos hooks específicos en `useStoreConfig.ts`
3. Actualiza el componente de ejemplo
4. Documenta los cambios en este README

---

¡Tu sistema de configuración está listo para producción! 🎉