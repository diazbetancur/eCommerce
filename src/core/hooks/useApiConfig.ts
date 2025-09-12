import { useCallback, useEffect, useState } from 'react';
import { ApiConfigService } from '../services/apiConfig.service';

interface UseApiConfigReturn {
  config: any;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  clearCache: () => Promise<void>;
  cacheInfo: {
    exists: boolean;
    expiresAt?: Date;
    expirationHours?: number;
  } | null;
}

export function useApiConfig(apiUrl?: string): UseApiConfigReturn {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);

  const apiConfigService = new ApiConfigService(apiUrl);

  const loadConfig = useCallback(
    async (forceRefresh: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔄 [useApiConfig] Cargando configuración (refresh: ${forceRefresh})`);

        const newConfig = await apiConfigService.getConfig(forceRefresh);
        setConfig(newConfig);

        // Obtener info del cache
        const info = await apiConfigService.getCacheInfo();
        setCacheInfo(info);

        console.log('✅ [useApiConfig] Configuración cargada exitosamente');
      } catch (err: any) {
        const errorMessage = err.message || 'Error desconocido';
        setError(errorMessage);
        console.error('❌ [useApiConfig] Error:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [apiConfigService]
  );

  const refreshConfig = useCallback(async () => {
    await loadConfig(true);
  }, [loadConfig]);

  const clearCache = useCallback(async () => {
    try {
      await apiConfigService.clearCache();
      await loadConfig(true); // Recargar después de limpiar cache
      console.log('✅ [useApiConfig] Cache limpiado y configuración recargada');
    } catch (err: any) {
      console.error('❌ [useApiConfig] Error limpiando cache:', err);
    }
  }, [apiConfigService, loadConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    refreshConfig,
    clearCache,
    cacheInfo
  };
}
