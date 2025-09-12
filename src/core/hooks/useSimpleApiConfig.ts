import { useCallback, useEffect, useState } from 'react';
import { SimpleApiConfigService } from '../services/simpleApiConfig.service';

interface UseSimpleApiConfigReturn {
  config: any;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  clearCache: () => Promise<void>;
  cacheStatus: {
    exists: boolean;
    isValid: boolean;
    expiresAt?: Date;
    ageInHours?: number;
  };
}

/**
 * Hook para usar el servicio de configuración API con cache de 24 horas
 */
export function useSimpleApiConfig(apiUrl?: string): UseSimpleApiConfigReturn {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState({
    exists: false,
    isValid: false
  });

  const configService = new SimpleApiConfigService(apiUrl);

  // Cargar configuración
  const loadConfig = useCallback(
    async (forceRefresh: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔄 [useSimpleApiConfig] Cargando configuración (refresh: ${forceRefresh})`);

        const newConfig = await configService.getConfig(forceRefresh);
        setConfig(newConfig);

        // Actualizar estado del cache
        const status = await configService.getCacheStatus();
        setCacheStatus(status);

        console.log('✅ [useSimpleApiConfig] Configuración cargada exitosamente');
      } catch (err: any) {
        const errorMessage = err?.message || 'Error desconocido';
        setError(errorMessage);
        console.error('❌ [useSimpleApiConfig] Error:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [configService]
  );

  // Refrescar configuración forzando llamada a API
  const refreshConfig = useCallback(async () => {
    console.log('🔄 [useSimpleApiConfig] Forzando refresh desde API');
    await loadConfig(true);
  }, [loadConfig]);

  // Limpiar cache y recargar
  const clearCache = useCallback(async () => {
    try {
      console.log('🗑️ [useSimpleApiConfig] Limpiando cache');
      await configService.clearCache();
      await loadConfig(true); // Recargar después de limpiar
      console.log('✅ [useSimpleApiConfig] Cache limpiado y configuración recargada');
    } catch (err: any) {
      console.error('❌ [useSimpleApiConfig] Error limpiando cache:', err);
      setError('Error limpiando cache');
    }
  }, [configService, loadConfig]);

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
