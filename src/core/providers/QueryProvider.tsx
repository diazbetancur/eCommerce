import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por defecto
      staleTime: 1000 * 60 * 5,
      // Mantener en cache por 10 minutos
      gcTime: 1000 * 60 * 10,
      // Reintentar 3 veces en caso de error
      retry: 3,
      // No refetch automático en focus de ventana
      refetchOnWindowFocus: false,
      // Mostrar datos en cache mientras se actualiza
      refetchOnMount: 'always'
    },
    mutations: {
      // Reintentar 1 vez las mutaciones
      retry: 1
    }
  }
});

interface QueryProviderProps {
  readonly children: ReactNode;
}

/**
 * Provider de React Query para la aplicación
 * Configura el cliente global de queries
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Hook para acceder al QueryClient desde componentes
 * Útil para invalidaciones manuales de cache
 */
export function useQueryClientAccess() {
  return queryClient;
}

// Exportar el cliente para uso directo si es necesario
export { queryClient };
