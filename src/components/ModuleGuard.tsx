import PropTypes from 'prop-types';
import React, { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useModules, useStoreConfigContext } from '../core/providers/AppProviders';

// Tipos para las props del componente
interface ModuleGuardProps {
  /** Nombre del módulo a verificar. Soporta notación punto para módulos anidados (ej: "checkout.paymentCreditCard") */
  module: string;
  /** Componentes hijos a renderizar si el módulo está activo */
  children: ReactNode;
  /** Componente o mensaje a mostrar si el módulo no está activo */
  fallback?: ReactNode;
  /** Componente personalizado para el estado de carga */
  loadingComponent?: ReactNode;
  /** Si debe mostrar un mensaje de debug cuando el módulo está deshabilitado */
  showDebugInfo?: boolean;
}

/**
 * Verifica si un módulo está habilitado, soportando notación punto para módulos anidados
 * @param modulePath - Ruta del módulo (ej: "checkout.paymentCreditCard")
 * @param modules - Objeto de configuración de módulos
 * @param isModuleEnabled - Función para verificar módulos simples
 * @returns boolean - true si el módulo está habilitado
 */
function checkModuleActive(
  modulePath: string,
  modules: Record<string, any>,
  isModuleEnabled: (module: string) => boolean
): boolean {
  // Si no hay notación punto, usar verificación simple
  if (!modulePath.includes('.')) {
    return isModuleEnabled(modulePath);
  }

  // Para módulos anidados, navegar por el objeto
  const parts = modulePath.split('.');
  let current: any = modules;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }

  return Boolean(current);
}

/**
 * Componente ModuleGuard para eCommerce
 *
 * Controla la renderización de componentes basado en la configuración de módulos activos.
 * Soporta módulos anidados y maneja estados de loading/error apropiadamente.
 *
 * @example
 * ```tsx
 * // Uso básico
 * <ModuleGuard module="wishlist">
 *   <WishlistPage />
 * </ModuleGuard>
 *
 * // Con fallback personalizado
 * <ModuleGuard
 *   module="reviews"
 *   fallback={<div>Las reseñas no están disponibles</div>}
 * >
 *   <ReviewsSection />
 * </ModuleGuard>
 *
 * // Módulos anidados
 * <ModuleGuard module="checkout.paymentCreditCard">
 *   <CreditCardForm />
 * </ModuleGuard>
 *
 * // Con loading personalizado
 * <ModuleGuard
 *   module="offers"
 *   loadingComponent={<CustomSpinner />}
 * >
 *   <OffersPage />
 * </ModuleGuard>
 * ```
 */
export function ModuleGuard({
  module,
  children,
  fallback = null,
  loadingComponent,
  showDebugInfo = false
}: ModuleGuardProps) {
  const { loading, error } = useStoreConfigContext();
  const { modules, isModuleEnabled } = useModules();

  // Estado de carga
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={styles.loadingText}>Verificando módulos...</Text>
      </View>
    );
  }

  // Estado de error - mostrar fallback o null
  if (error) {
    if (showDebugInfo) {
      console.warn(`[ModuleGuard] Error verificando módulo "${module}":`, error.message);
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return null;
  }

  // Verificar si el módulo está activo
  const moduleActive = checkModuleActive(module, modules, isModuleEnabled);

  if (showDebugInfo) {
    console.log(`[ModuleGuard] Módulo "${module}":`, {
      active: moduleActive,
      allModules: modules
    });
  }

  // Si el módulo está activo, renderizar children
  if (moduleActive) {
    return <>{children}</>;
  }

  // Si el módulo no está activo, renderizar fallback o null
  if (fallback) {
    return <>{fallback}</>;
  }

  // Si showDebugInfo está activo y no hay fallback, mostrar info de debug
  if (showDebugInfo && __DEV__) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>🚫 Módulo "{module}" deshabilitado</Text>
      </View>
    );
  }

  return null;
}

// PropTypes para validación en tiempo de ejecución
ModuleGuard.propTypes = {
  module: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  loadingComponent: PropTypes.node,
  showDebugInfo: PropTypes.bool
};

// Default props
ModuleGuard.defaultProps = {
  fallback: null,
  loadingComponent: null,
  showDebugInfo: false
};

/**
 * Hook personalizado para verificar múltiples módulos a la vez
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { areModulesActive, anyModuleActive } = useMultipleModules([
 *     'wishlist',
 *     'reviews',
 *     'checkout.paymentCreditCard'
 *   ]);
 *
 *   if (!anyModuleActive) {
 *     return <div>Ninguna funcionalidad disponible</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {areModulesActive.wishlist && <WishlistButton />}
 *       {areModulesActive.reviews && <ReviewsSection />}
 *       {areModulesActive['checkout.paymentCreditCard'] && <CreditCardForm />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultipleModules(moduleNames: string[]) {
  const { modules, isModuleEnabled } = useModules();

  const areModulesActive = moduleNames.reduce((acc, moduleName) => {
    acc[moduleName] = checkModuleActive(moduleName, modules, isModuleEnabled);
    return acc;
  }, {} as Record<string, boolean>);

  const anyModuleActive = Object.values(areModulesActive).some(Boolean);
  const allModulesActive = Object.values(areModulesActive).every(Boolean);

  return {
    areModulesActive,
    anyModuleActive,
    allModulesActive
  };
}

/**
 * Componente de orden superior (HOC) para envolver componentes con ModuleGuard
 *
 * @example
 * ```tsx
 * const ProtectedWishlist = withModuleGuard('wishlist')(WishlistPage);
 *
 * // Con opciones
 * const ProtectedReviews = withModuleGuard('reviews', {
 *   fallback: <div>Reseñas no disponibles</div>,
 *   showDebugInfo: true
 * })(ReviewsPage);
 * ```
 */
export function withModuleGuard(
  module: string,
  options: Omit<ModuleGuardProps, 'module' | 'children'> = {}
) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    const WrappedComponent = (props: P) => (
      <ModuleGuard module={module} {...options}>
        <Component {...props} />
      </ModuleGuard>
    );

    WrappedComponent.displayName = `withModuleGuard(${Component.displayName || Component.name})`;
    return WrappedComponent;
  };
}

/**
 * Componente para mostrar una lista de módulos disponibles (útil para debug)
 */
export function ModulesList({ showOnlyActive = false }: { showOnlyActive?: boolean }) {
  const { modules, loading } = useModules();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={styles.loadingText}>Cargando módulos...</Text>
      </View>
    );
  }

  const displayModules = showOnlyActive
    ? Object.entries(modules).filter(([_, enabled]) => enabled)
    : Object.entries(modules);

  return (
    <View style={styles.modulesListContainer}>
      <Text style={styles.modulesListTitle}>
        {showOnlyActive ? 'Módulos Activos' : 'Todos los Módulos'}
      </Text>
      {displayModules.map(([moduleName, enabled]) => (
        <View key={moduleName} style={styles.moduleItem}>
          <Text style={styles.moduleEmoji}>{enabled ? '✅' : '❌'}</Text>
          <Text style={styles.moduleName}>{moduleName}</Text>
          <Text style={styles.moduleStatus}>{enabled ? 'Habilitado' : 'Deshabilitado'}</Text>
        </View>
      ))}
      {displayModules.length === 0 && (
        <Text style={styles.noModulesText}>
          {showOnlyActive ? 'No hay módulos activos' : 'No hay módulos configurados'}
        </Text>
      )}
    </View>
  );
}

// Estilos para los componentes
const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center'
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666'
  },
  debugContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    margin: 4
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center'
  },
  modulesListContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    margin: 8
  },
  modulesListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  moduleEmoji: {
    fontSize: 14,
    marginRight: 8
  },
  moduleName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  moduleStatus: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  noModulesText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 16
  }
});
