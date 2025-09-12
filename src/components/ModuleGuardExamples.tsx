import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppProviders } from '../core/providers/AppProviders';
import { ModuleGuard, ModulesList, useMultipleModules, withModuleGuard } from './ModuleGuard';

// Estilos para fallbacks (declarados primero)
const fallbackStyles = StyleSheet.create({
  disabledContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336'
  },
  disabledText: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

/**
 * Componentes de ejemplo para demostrar ModuleGuard
 */

// Componente simple protegido por módulo
function WishlistPage() {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>🤍 Lista de Deseos</Text>
      <Text style={styles.pageContent}>
        Aquí puedes ver todos los productos que has guardado en tu lista de deseos.
      </Text>
    </View>
  );
}

function ReviewsSection() {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>⭐ Sección de Reseñas</Text>
      <Text style={styles.sectionContent}>Lee y escribe reseñas de productos.</Text>
    </View>
  );
}

function CreditCardForm() {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>💳 Formulario de Tarjeta de Crédito</Text>
      <Text style={styles.formContent}>
        Ingresa los datos de tu tarjeta para proceder con el pago.
      </Text>
    </View>
  );
}

function OffersPage() {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>🎉 Ofertas Especiales</Text>
      <Text style={styles.pageContent}>Descubre las mejores ofertas y descuentos disponibles.</Text>
    </View>
  );
}

// Componente con HOC
const ProtectedWishlist = withModuleGuard('wishlist', {
  fallback: (
    <View style={fallbackStyles.disabledContainer}>
      <Text style={fallbackStyles.disabledText}>
        🚫 La funcionalidad de lista de deseos no está disponible
      </Text>
    </View>
  ),
  showDebugInfo: true
})(WishlistPage);

// Componente que usa múltiples módulos
function ConditionalFeatures() {
  const { areModulesActive, anyModuleActive, allModulesActive } = useMultipleModules([
    'wishlist',
    'reviews',
    'offers',
    'checkout.paymentCreditCard' // Módulo anidado
  ]);

  if (!anyModuleActive) {
    return (
      <View style={styles.noFeaturesContainer}>
        <Text style={styles.noFeaturesText}>
          😔 No hay funcionalidades disponibles en este momento
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.featuresContainer}>
      <Text style={styles.featuresTitle}>🎛️ Funcionalidades Disponibles</Text>

      {areModulesActive.wishlist && (
        <TouchableOpacity style={[styles.featureButton, styles.wishlistButton]}>
          <Text style={styles.featureButtonText}>🤍 Lista de Deseos</Text>
        </TouchableOpacity>
      )}

      {areModulesActive.reviews && (
        <TouchableOpacity style={[styles.featureButton, styles.reviewsButton]}>
          <Text style={styles.featureButtonText}>⭐ Reseñas</Text>
        </TouchableOpacity>
      )}

      {areModulesActive.offers && (
        <TouchableOpacity style={[styles.featureButton, styles.offersButton]}>
          <Text style={styles.featureButtonText}>🎉 Ofertas</Text>
        </TouchableOpacity>
      )}

      {areModulesActive['checkout.paymentCreditCard'] && (
        <TouchableOpacity style={[styles.featureButton, styles.paymentButton]}>
          <Text style={styles.featureButtonText}>💳 Pago con Tarjeta</Text>
        </TouchableOpacity>
      )}

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Estado: {allModulesActive ? 'Todas activas' : 'Algunas activas'}
        </Text>
      </View>
    </View>
  );
}

/**
 * Componente principal que demuestra todos los casos de uso
 */
export function ModuleGuardExamples() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>🛡️ Ejemplos de ModuleGuard</Text>

      {/* Lista de módulos disponibles */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>📋 Estado de Módulos</Text>
        <ModulesList />
      </View>

      {/* Ejemplo básico */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1️⃣ Uso Básico</Text>
        <ModuleGuard module="wishlist">
          <WishlistPage />
        </ModuleGuard>
      </View>

      {/* Ejemplo con fallback */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2️⃣ Con Fallback Personalizado</Text>
        <ModuleGuard
          module="reviews"
          fallback={
            <View style={styles.customFallback}>
              <Text style={styles.customFallbackText}>
                ⚠️ Las reseñas están temporalmente deshabilitadas
              </Text>
            </View>
          }
        >
          <ReviewsSection />
        </ModuleGuard>
      </View>

      {/* Ejemplo con módulo anidado */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3️⃣ Módulos Anidados</Text>
        <ModuleGuard
          module="checkout.paymentCreditCard"
          fallback={
            <View style={styles.customFallback}>
              <Text style={styles.customFallbackText}>
                💳 Pago con tarjeta de crédito no disponible
              </Text>
            </View>
          }
          showDebugInfo={true}
        >
          <CreditCardForm />
        </ModuleGuard>
      </View>

      {/* Ejemplo con loading personalizado */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4️⃣ Loading Personalizado</Text>
        <ModuleGuard
          module="offers"
          loadingComponent={
            <View style={styles.customLoading}>
              <Text style={styles.customLoadingText}>🔄 Verificando ofertas...</Text>
            </View>
          }
        >
          <OffersPage />
        </ModuleGuard>
      </View>

      {/* Ejemplo con HOC */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5️⃣ Usando HOC (withModuleGuard)</Text>
        <ProtectedWishlist />
      </View>

      {/* Ejemplo con múltiples módulos */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>6️⃣ Múltiples Módulos</Text>
        <ConditionalFeatures />
      </View>

      {/* Debug info */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>🔍 Debug - Solo Módulos Activos</Text>
        <ModulesList showOnlyActive={true} />
      </View>
    </ScrollView>
  );
}

/**
 * App de ejemplo completa con AppProviders
 */
export function ModuleGuardApp() {
  // Configuración de ejemplo con algunos módulos deshabilitados
  const exampleConfig = {
    modules: {
      wishlist: true,
      reviews: false, // Deshabilitado para demostrar fallbacks
      offers: true,
      checkout: true // Simplificado para que coincida con el tipo
    }
  };

  return (
    <AppProviders storeId="example-store" fallbackConfig={exampleConfig}>
      <ModuleGuardExamples />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 12
  },
  pageContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8
  },
  pageContent: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20
  },
  sectionContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 6
  },
  sectionContent: {
    fontSize: 14,
    color: '#424242'
  },
  formContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50'
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 6
  },
  formContent: {
    fontSize: 14,
    color: '#424242'
  },
  disabledContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336'
  },
  disabledText: {
    fontSize: 14,
    color: '#c62828',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  customFallback: {
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffcc02',
    borderStyle: 'dashed'
  },
  customFallbackText: {
    fontSize: 14,
    color: '#f57c00',
    textAlign: 'center',
    fontWeight: '500'
  },
  customLoading: {
    backgroundColor: '#f3e5f5',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center'
  },
  customLoadingText: {
    fontSize: 14,
    color: '#7b1fa2',
    fontWeight: '500'
  },
  featuresContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  featureButton: {
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
    alignItems: 'center'
  },
  wishlistButton: {
    backgroundColor: '#e91e63'
  },
  reviewsButton: {
    backgroundColor: '#ff9800'
  },
  offersButton: {
    backgroundColor: '#4caf50'
  },
  paymentButton: {
    backgroundColor: '#2196f3'
  },
  featureButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  statusContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  noFeaturesContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 16,
    alignItems: 'center'
  },
  noFeaturesText: {
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
    fontWeight: '500'
  }
});
