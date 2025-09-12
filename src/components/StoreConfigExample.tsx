import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useBranding,
  useBusiness,
  useConfigCache,
  useCurrency,
  useModules,
  useStoreConfigContext
} from '../core/providers/AppProviders';

/**
 * Componente de ejemplo que demuestra el uso del Context de configuración
 */
export function StoreConfigExample() {
  const [showDetails, setShowDetails] = useState(false);

  // Hook principal del contexto
  const { config, loading, error, isDefaultConfig } = useStoreConfigContext();

  // Hooks específicos para diferentes aspectos
  const { branding } = useBranding();
  const { formatPrice, formatCurrency, currency } = useCurrency();
  const { modules } = useModules();
  const { business } = useBusiness();
  const { clearCache, refreshConfig } = useConfigCache();

  // Handlers para acciones
  const handleShowInfo = () => {
    Alert.alert(
      'Información de la Tienda',
      `Tienda: ${business.name}\n` +
        `Email: ${business.contactEmail}\n` +
        `Color principal: ${branding.primaryColor}\n` +
        `Moneda: ${currency.code} (${currency.symbol})\n` +
        `Tipo: ${isDefaultConfig ? 'Configuración por defecto' : 'Configuración del servidor'}`
    );
  };

  const handleRefreshConfig = async () => {
    try {
      await refreshConfig();
      Alert.alert('Éxito', 'Configuración actualizada');
    } catch (err) {
      console.error('Error actualizando configuración:', err);
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
  };

  const handleClearCache = () => {
    Alert.alert('Limpiar Cache', '¿Estás seguro de que quieres limpiar el cache?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpiar',
        style: 'destructive',
        onPress: () => {
          clearCache();
          Alert.alert('Cache limpiado', 'El cache ha sido eliminado');
        }
      }
    ]);
  };

  // Crear estilos dinámicos basados en la configuración
  const dynamicStyles = StyleSheet.create({
    primaryButton: {
      backgroundColor: branding.primaryColor,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4
    },
    secondaryButton: {
      backgroundColor: branding.secondaryColor,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4
    },
    accentButton: {
      backgroundColor: branding.accentColor,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4
    },
    storeName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: branding.primaryColor,
      textAlign: 'center',
      marginBottom: 8
    },
    priceText: {
      fontSize: 18,
      color: branding.accentColor,
      fontWeight: '600'
    }
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>⏳ Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header con estado */}
      <View style={styles.header}>
        <Text style={dynamicStyles.storeName}>{business.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {isDefaultConfig ? '🔧 Config por defecto' : '✅ Config del servidor'}
          </Text>
        </View>
        {error && (
          <View style={styles.errorBadge}>
            <Text style={styles.errorText}>❌ Error: {error.message}</Text>
          </View>
        )}
      </View>

      {/* Información del negocio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏪 Información del Negocio</Text>
        <Text style={styles.infoText}>Nombre: {business.name}</Text>
        <Text style={styles.infoText}>Email: {business.contactEmail}</Text>
        <Text style={styles.infoText}>Store ID: {config.storeId}</Text>
      </View>

      {/* Colores de branding */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Branding</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: branding.primaryColor }]} />
          <Text style={styles.colorText}>Principal: {branding.primaryColor}</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: branding.secondaryColor }]} />
          <Text style={styles.colorText}>Secundario: {branding.secondaryColor}</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: branding.accentColor }]} />
          <Text style={styles.colorText}>Acento: {branding.accentColor}</Text>
        </View>
      </View>

      {/* Ejemplos de precios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Ejemplos de Precios</Text>
        <Text style={dynamicStyles.priceText}>Básico: {formatPrice(19.99)}</Text>
        <Text style={dynamicStyles.priceText}>Premium: {formatPrice(49.99)}</Text>
        <Text style={dynamicStyles.priceText}>
          Con código: {formatCurrency(99.99, { showCode: true })}
        </Text>
      </View>

      {/* Módulos habilitados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Módulos</Text>
        {Object.entries(modules).map(([moduleName, enabled]) => (
          <View key={moduleName} style={styles.moduleRow}>
            <Text style={styles.moduleText}>
              {enabled ? '✅' : '❌'} {moduleName}: {enabled ? 'Habilitado' : 'Deshabilitado'}
            </Text>
          </View>
        ))}
      </View>

      {/* Botones de acción con colores dinámicos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎛️ Acciones</Text>

        <TouchableOpacity style={dynamicStyles.primaryButton} onPress={handleShowInfo}>
          <Text style={styles.buttonText}>📋 Mostrar Información</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.secondaryButton} onPress={handleRefreshConfig}>
          <Text style={styles.buttonText}>🔄 Actualizar Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dynamicStyles.accentButton} onPress={handleClearCache}>
          <Text style={styles.buttonText}>🗑️ Limpiar Cache</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.detailsButton} onPress={() => setShowDetails(!showDetails)}>
          <Text style={styles.buttonText}>
            {showDetails ? '📤 Ocultar Detalles' : '📥 Mostrar Detalles'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Detalles técnicos */}
      {showDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Detalles Técnicos</Text>
          <ScrollView style={styles.jsonContainer} horizontal>
            <Text style={styles.jsonText}>{JSON.stringify(config, null, 2)}</Text>
          </ScrollView>
        </View>
      )}

      {/* CSS Variables info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 CSS Variables Aplicadas</Text>
        <Text style={styles.infoText}>--color-primary: {branding.primaryColor}</Text>
        <Text style={styles.infoText}>--color-secondary: {branding.secondaryColor}</Text>
        <Text style={styles.infoText}>--color-accent: {branding.accentColor}</Text>
        <Text style={styles.infoText}>--currency-symbol: "{currency.symbol}"</Text>
        <Text style={styles.infoText}>--currency-code: "{currency.code}"</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50
  },
  header: {
    marginBottom: 20
  },
  statusBadge: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8
  },
  statusText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500'
  },
  errorBadge: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '500'
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace'
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  colorText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace'
  },
  moduleRow: {
    marginBottom: 4
  },
  moduleText: {
    fontSize: 14,
    color: '#333'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  detailsButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4
  },
  jsonContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    maxHeight: 200
  },
  jsonText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'monospace'
  }
});
