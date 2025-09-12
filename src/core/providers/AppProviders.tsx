import React, { ReactNode } from 'react';
import { StoreConfigProvider } from '../context/StoreConfigContext';
import type { StoreConfig } from '../services/storeConfig.service';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  readonly children: ReactNode;
  readonly storeId?: string;
  readonly fallbackConfig?: Partial<StoreConfig>;
}

/**
 * Provider principal que combina todos los providers necesarios
 * Incluye QueryProvider y StoreConfigProvider
 *
 * @example
 * ```tsx
 * // En tu App.js o index.js
 * function App() {
 *   return (
 *     <AppProviders storeId="mi-tienda-123">
 *       <Navigation />
 *     </AppProviders>
 *   );
 * }
 * ```
 */
export function AppProviders({ children, storeId, fallbackConfig }: AppProvidersProps) {
  return (
    <QueryProvider>
      <StoreConfigProvider storeId={storeId} fallbackConfig={fallbackConfig}>
        {children}
      </StoreConfigProvider>
    </QueryProvider>
  );
}

// Re-exportar hooks para fácil acceso
export {
  useBranding,
  useBusiness,
  useConfigCache,
  useCurrency,
  useModules,
  useStoreConfigContext
} from '../context/StoreConfigContext';

export { useQueryClientAccess } from './QueryProvider';
