import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { storeConfigService, type StoreConfig } from '../services/storeConfig.service';

// Valores por defecto según especificación
const DEFAULT_CONFIG: StoreConfig = {
  storeId: 'default',
  branding: {
    primaryColor: '#000000',
    secondaryColor: '#666666',
    accentColor: '#007bff',
    logoUrl: '',
    fontFamily: 'Arial',
    borderRadius: '8px'
  },
  currency: {
    code: 'USD',
    symbol: '$',
    decimalPlaces: 2
  },
  modules: {
    checkout: true,
    wishlist: true,
    reviews: true
  },
  business: {
    name: 'Mi Tienda',
    contactEmail: 'contacto@mitienda.com'
  },
  configVersion: '1.0.0'
};

// Interfaz del contexto
interface StoreConfigContextValue {
  config: StoreConfig;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  isDefaultConfig: boolean;
}

// Crear el contexto
const StoreConfigContext = createContext<StoreConfigContextValue | undefined>(undefined);

// Props del provider
interface StoreConfigProviderProps {
  readonly children: ReactNode;
  readonly storeId?: string;
  readonly fallbackConfig?: Partial<StoreConfig>;
}

/**
 * Provider del contexto de configuración de tienda
 * Usa React Query para fetching y caching automático
 */
export function StoreConfigProvider({
  children,
  storeId,
  fallbackConfig
}: StoreConfigProviderProps) {
  // Combinar config por defecto con fallback personalizado
  const finalDefaultConfig = {
    ...DEFAULT_CONFIG,
    ...fallbackConfig,
    branding: {
      ...DEFAULT_CONFIG.branding,
      ...fallbackConfig?.branding
    },
    currency: {
      ...DEFAULT_CONFIG.currency,
      ...fallbackConfig?.currency
    },
    modules: {
      ...DEFAULT_CONFIG.modules,
      ...fallbackConfig?.modules
    },
    business: {
      ...DEFAULT_CONFIG.business,
      ...fallbackConfig?.business
    }
  };

  // Query para obtener configuración
  const {
    data: fetchedConfig,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['storeConfig', storeId],
    queryFn: () => storeConfigService.getStoreConfig(false),
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Configuración final (fetcheada o por defecto)
  const config = fetchedConfig || finalDefaultConfig;
  const isDefaultConfig = !fetchedConfig;

  // Aplicar CSS variables cuando cambie la configuración
  useEffect(() => {
    if (config?.branding) {
      const root = document.documentElement;

      // Aplicar colores como CSS variables
      root.style.setProperty('--color-primary', config.branding.primaryColor);
      root.style.setProperty('--color-secondary', config.branding.secondaryColor);
      root.style.setProperty('--color-accent', config.branding.accentColor);

      // Generar variaciones automáticas
      root.style.setProperty(
        '--color-primary-light',
        lightenColor(config.branding.primaryColor, 20)
      );
      root.style.setProperty('--color-primary-dark', darkenColor(config.branding.primaryColor, 20));
      root.style.setProperty(
        '--color-secondary-light',
        lightenColor(config.branding.secondaryColor, 20)
      );
      root.style.setProperty(
        '--color-secondary-dark',
        darkenColor(config.branding.secondaryColor, 20)
      );

      // Aplicar variables de moneda
      root.style.setProperty('--currency-symbol', `"${config.currency.symbol}"`);
      root.style.setProperty('--currency-code', `"${config.currency.code}"`);

      console.log('🎨 [StoreConfigContext] CSS variables aplicadas:', {
        primary: config.branding.primaryColor,
        secondary: config.branding.secondaryColor,
        accent: config.branding.accentColor,
        currency: config.currency
      });
    }
  }, [config]);

  // Log del estado de configuración
  useEffect(() => {
    if (isLoading) {
      console.log('⏳ [StoreConfigContext] Cargando configuración...');
    } else if (error) {
      console.error('❌ [StoreConfigContext] Error cargando configuración:', error);
      console.log('🔄 [StoreConfigContext] Usando configuración por defecto');
    } else if (fetchedConfig) {
      console.log('✅ [StoreConfigContext] Configuración cargada exitosamente');
      console.log('🏪 [StoreConfigContext] Tienda:', fetchedConfig.business.name);
    } else {
      console.log('⚠️ [StoreConfigContext] Usando configuración por defecto');
    }
  }, [isLoading, error, fetchedConfig]);

  // Valor del contexto con useMemo para optimización
  const contextValue: StoreConfigContextValue = useMemo(
    () => ({
      config,
      loading: isLoading,
      error,
      refetch,
      isDefaultConfig
    }),
    [config, isLoading, error, refetch, isDefaultConfig]
  );

  return <StoreConfigContext.Provider value={contextValue}>{children}</StoreConfigContext.Provider>;
}

/**
 * Hook para usar el contexto de configuración de tienda
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, loading, error, refetch } = useStoreConfigContext();
 *
 *   if (loading) return <div>Cargando...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div style={{ color: config.branding.primaryColor }}>
 *       <h1>{config.business.name}</h1>
 *       <button onClick={() => refetch()}>Actualizar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useStoreConfigContext(): StoreConfigContextValue {
  const context = useContext(StoreConfigContext);

  if (context === undefined) {
    throw new Error('useStoreConfigContext debe usarse dentro de StoreConfigProvider');
  }

  return context;
}

/**
 * Hook para obtener solo el branding
 */
export function useBranding() {
  const { config, loading, error } = useStoreConfigContext();

  return {
    branding: config.branding,
    loading,
    error
  };
}

/**
 * Hook para obtener configuración de moneda con formateo
 */
export function useCurrency() {
  const { config, loading, error } = useStoreConfigContext();

  const formatPrice = (amount: number): string => {
    const { symbol, decimalPlaces } = config.currency;
    return `${symbol}${amount.toFixed(decimalPlaces)}`;
  };

  const formatCurrency = (
    amount: number,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
    }
  ): string => {
    const { symbol, code, decimalPlaces } = config.currency;
    const { showSymbol = true, showCode = false } = options || {};

    let formatted = amount.toFixed(decimalPlaces);

    if (showSymbol) {
      formatted = `${symbol}${formatted}`;
    }

    if (showCode) {
      formatted = `${formatted} ${code}`;
    }

    return formatted;
  };

  return {
    currency: config.currency,
    formatPrice,
    formatCurrency,
    loading,
    error
  };
}

/**
 * Hook para verificar módulos habilitados
 */
export function useModules() {
  const { config, loading, error } = useStoreConfigContext();

  const isModuleEnabled = (moduleName: string): boolean => {
    return config.modules[moduleName] || false;
  };

  return {
    modules: config.modules,
    isModuleEnabled,
    loading,
    error
  };
}

/**
 * Hook para obtener información del negocio
 */
export function useBusiness() {
  const { config, loading, error } = useStoreConfigContext();

  return {
    business: config.business,
    loading,
    error
  };
}

/**
 * Hook para invalidar cache manualmente
 */
export function useConfigCache() {
  const queryClient = useQueryClient();
  const { refetch } = useStoreConfigContext();

  const invalidateConfig = async () => {
    await queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
  };

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['storeConfig'] });
    storeConfigService.clearCache();
  };

  const refreshConfig = async () => {
    return await refetch();
  };

  return {
    invalidateConfig,
    clearCache,
    refreshConfig
  };
}

// Funciones helper para manipular colores
function lightenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;

    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}

function darkenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;

    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}
