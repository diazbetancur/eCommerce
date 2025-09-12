import { useCallback, useEffect, useState } from 'react';
import { storeConfigService, type StoreConfig } from '../services/storeConfig.service';

interface UseStoreConfigReturn {
  config: StoreConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  clearCache: () => void;
  cacheStatus: {
    exists: boolean;
    isValid: boolean;
    isCorrectStore: boolean;
    expiresAt?: Date;
    ageInHours?: number;
  };
}

/**
 * Hook para usar la configuración de tienda con cache automático
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, loading, error, refreshConfig } = useStoreConfig();
 *
 *   if (loading) return <div>Cargando configuración...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div style={{ color: config?.branding.primaryColor }}>
 *       <h1>{config?.business.name}</h1>
 *       <button onClick={refreshConfig}>Actualizar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useStoreConfig(): UseStoreConfigReturn {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState({
    exists: false,
    isValid: false,
    isCorrectStore: false
  });

  // Cargar configuración
  const loadConfig = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 [useStoreConfig] Cargando configuración (refresh: ${forceRefresh})`);

      const newConfig = await storeConfigService.getStoreConfig(forceRefresh);
      setConfig(newConfig);

      // Actualizar estado del cache
      const status = storeConfigService.getCacheStatus();
      setCacheStatus(status);

      console.log('✅ [useStoreConfig] Configuración cargada exitosamente');
      console.log('🏪 [useStoreConfig] Tienda:', newConfig.business.name);
      console.log('🎨 [useStoreConfig] Color primario:', newConfig.branding.primaryColor);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error desconocido cargando configuración';
      setError(errorMessage);
      console.error('❌ [useStoreConfig] Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar configuración forzando llamada a API
  const refreshConfig = useCallback(async () => {
    console.log('🔄 [useStoreConfig] Forzando refresh desde API');
    await loadConfig(true);
  }, [loadConfig]);

  // Limpiar cache
  const clearCache = useCallback(() => {
    try {
      console.log('🗑️ [useStoreConfig] Limpiando cache');
      storeConfigService.clearCache();

      // Actualizar estado del cache
      const status = storeConfigService.getCacheStatus();
      setCacheStatus(status);

      console.log('✅ [useStoreConfig] Cache limpiado');
    } catch (err: any) {
      console.error('❌ [useStoreConfig] Error limpiando cache:', err);
      setError('Error limpiando cache');
    }
  }, []);

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    refreshConfig,
    clearCache,
    cacheStatus
  };
}

/**
 * Hook para obtener solo el branding/tema de la tienda
 */
export function useStoreBranding() {
  const { config, loading, error } = useStoreConfig();

  return {
    branding: config?.branding || null,
    loading,
    error
  };
}

/**
 * Hook para obtener configuración de módulos habilitados
 */
export function useStoreModules() {
  const { config, loading, error } = useStoreConfig();

  return {
    modules: config?.modules || {},
    loading,
    error,
    isModuleEnabled: (moduleName: string) => config?.modules[moduleName] || false
  };
}

/**
 * Hook para obtener información de moneda de la tienda
 */
export function useStoreCurrency() {
  const { config, loading, error } = useStoreConfig();

  const formatPrice = useCallback(
    (amount: number) => {
      if (!config?.currency) return amount.toString();

      const { symbol, decimalPlaces } = config.currency;
      return `${symbol}${amount.toFixed(decimalPlaces)}`;
    },
    [config?.currency]
  );

  return {
    currency: config?.currency || null,
    loading,
    error,
    formatPrice
  };
}
