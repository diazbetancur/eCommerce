# 🔧 API Configuration Service

Servicio para obtener configuración dinámica desde una API con cache configurable y fallback automático.

## 🚀 Características

- ✅ **Cache configurable**: 24 horas por defecto, configurable desde API
- ✅ **Fallback automático**: Si falla API, usa configuración local
- ✅ **Merge inteligente**: Combina config API con config local
- ✅ **Logging detallado**: Para debugging y monitoring
- ✅ **Gestión de cache**: Limpiar, verificar expiración, etc.

## 📖 Uso Básico

### Con Hook (Recomendado)

```typescript
import { useApiConfig } from './src/core/hooks/useApiConfig';

function MyComponent() {
  const { 
    config, 
    loading, 
    error, 
    refreshConfig, 
    clearCache, 
    cacheInfo 
  } = useApiConfig('https://api.miapp.com/config');

  if (loading) return <Loading />;
  if (error) console.warn('Config error:', error);

  return (
    <View>
      <Text>App Name: {config.branding?.appName}</Text>
      <Text>Primary Color: {config.colors?.primary}</Text>
    </View>
  );
}
```

### Con Servicio Directo

```typescript
import { ApiConfigService } from './src/core/services/apiConfig.service';

const configService = new ApiConfigService('https://api.miapp.com/config');

// Obtener configuración (con cache)
const config = await configService.getConfig();

// Forzar refresh desde API
const freshConfig = await configService.getConfig(true);

// Limpiar cache
await configService.clearCache();

// Info del cache
const cacheInfo = await configService.getCacheInfo();
```

## 📋 Formato de Respuesta API

```json
{
  "colors": {
    "primary": "#FF5722",
    "secondary": "#2196F3",
    "accent": "#FFC107"
  },
  "modules": {
    "cart": true,
    "loyalty": false,
    "support": true
  },
  "subscription": {
    "plan": "premium",
    "expires": "2025-12-31"
  },
  "branding": {
    "appName": "Mi App Custom",
    "logo": "https://mi-api.com/logo.png"
  },
  "settings": {
    "maxProducts": 100,
    "enableNotifications": true
  },
  "cacheExpirationHours": 12
}
```

## ⚙️ Configuración

### Cache por Defecto
- **Duración**: 24 horas
- **Configurable desde API**: Campo `cacheExpirationHours`
- **Storage**: AsyncStorage con clave `api_config_cache`

### Fallback
- Si API falla → Usa cache si existe
- Si cache expiró → Usa `APP_CONFIG` local
- Siempre funciona, nunca falla completamente

## 🛠️ Debug en Desarrollo

Incluye `ConfigDebugPanel` para testing:

```jsx
import ConfigDebugPanel from './src/core/components/ConfigDebugPanel';

export default function App() {
  return (
    <View>
      {/* Tu app */}
      <ConfigDebugPanel /> {/* Solo en desarrollo */}
    </View>
  );
}
```

## 📊 Estrategia de Cache

1. **Primera carga**: Fetch desde API → Cache → Usar
2. **Cargas posteriores**: Cache válido? → Usar cache : Fetch API
3. **Error de red**: Cache existe? → Usar cache : Fallback local
4. **Expiración**: Configurable por API o 24h por defecto

## 🔄 Flujo de Fallback

```
API Request
    ↓
   ❌ Error?
    ↓
Cache válido?
    ↓
   ❌ No existe/expiró?
    ↓
APP_CONFIG local
```

## 🎯 Casos de Uso

- **Configuración por cliente**: Colores, branding, módulos
- **Feature flags**: Habilitar/deshabilitar funciones
- **Configuración de negocio**: Límites, precios, etc.
- **A/B Testing**: Variaciones de configuración
- **Configuración de emergencia**: Cambios sin redeploy

## 🚨 Manejo de Errores

- **Timeout**: 10 segundos por defecto
- **Error de red**: Log + fallback automático
- **JSON inválido**: Log + fallback automático
- **Cache corrupto**: Limpia automáticamente + fallback

## 💡 Mejores Prácticas

1. **Siempre tener fallback local** en `APP_CONFIG`
2. **Usar merge inteligente** para compatibilidad
3. **Configurar cache apropiado** según frecuencia de cambios
4. **Logging apropiado** para monitoring en producción
5. **Testing con ConfigDebugPanel** en desarrollo