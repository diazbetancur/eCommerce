import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useStoreConfig } from '../../core/hooks/useStoreConfig';

interface ConfigDebugPanelProps {
  visible?: boolean;
  onClose?: () => void;
}

/**
 * Panel de debug para visualizar y gestionar la configuración de tienda
 * Solo debe usarse en desarrollo
 */
export function ConfigDebugPanel({ visible = true, onClose }: ConfigDebugPanelProps) {
  const { config, loading, error, refreshConfig, clearCache, cacheStatus } = useStoreConfig();

  if (!visible) return null;

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Cache',
      '¿Estás seguro de que quieres limpiar el cache de configuración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpiar', style: 'destructive', onPress: clearCache },
      ]
    );
  };

  const getCacheStatusText = () => {
    if (!cacheStatus.exists) return '❌ Sin cache';
    if (!cacheStatus.isValid) return '⏰ Cache expirado';
    if (!cacheStatus.isCorrectStore) return '🏪 Cache de otra tienda';
    return '✅ Cache válido';
  };

  const getCacheAgeText = () => {
    if (cacheStatus.ageInHours !== undefined) {
      return `(${cacheStatus.ageInHours.toFixed(1)}h)`;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Config Debug Panel</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado general */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estado General</Text>
          <Text style={styles.item}>Loading: {loading ? '⏳ Sí' : '✅ No'}</Text>
          <Text style={styles.item}>Error: {error ? `❌ ${error}` : '✅ Sin errores'}</Text>
          <Text style={styles.item}>Config: {config ? '✅ Cargada' : '❌ No disponible'}</Text>
        </View>

        {/* Estado del cache */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Estado del Cache</Text>
          <Text style={styles.item}>
            Estado: {getCacheStatusText()} {getCacheAgeText()}
          </Text>
          {cacheStatus.expiresAt && (
            <Text style={styles.item}>
              Expira: {cacheStatus.expiresAt.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Configuración actual */}
        {config && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏪 Configuración Actual</Text>
            <Text style={styles.item}>Tienda: {config.business.name}</Text>
            <Text style={styles.item}>ID: {config.storeId}</Text>
            <Text style={styles.item}>Color: {config.branding.primaryColor}</Text>
            <Text style={styles.item}>Moneda: {config.currency.symbol}</Text>
            <Text style={styles.item}>
              Módulos: {Object.entries(config.modules)
                .filter(([_, enabled]) => enabled)
                .map(([name, _]) => name)
                .join(', ') || 'Ninguno'}
            </Text>
          </View>
        )}

        {/* Variables de entorno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Variables de Entorno</Text>
          <Text style={styles.item}>
            API URL: {process.env.REACT_APP_CONFIG_API || '❌ No configurada'}
          </Text>
          <Text style={styles.item}>
            Store ID: {process.env.REACT_APP_STORE_ID || '❌ No configurada'}
          </Text>
        </View>

        {/* Acciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Acciones</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.refreshButton]} 
            onPress={refreshConfig}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Cargando...' : '🔄 Refrescar desde API'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={handleClearCache}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🗑️ Limpiar Cache</Text>
          </TouchableOpacity>
        </View>

        {/* JSON completo (colapsible) */}
        {config && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 JSON Completo</Text>
            <ScrollView 
              style={styles.jsonContainer} 
              horizontal 
              showsHorizontalScrollIndicator={false}
            >
              <Text style={styles.jsonText}>
                {JSON.stringify(config, null, 2)}
              </Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 320,
    maxHeight: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#4a9eff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  item: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 3,
    fontFamily: 'monospace',
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#4a9eff',
  },
  clearButton: {
    backgroundColor: '#ff4a4a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  jsonContainer: {
    maxHeight: 150,
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 4,
  },
  jsonText: {
    color: '#a0d8b0',
    fontSize: 9,
    fontFamily: 'monospace',
  },
});

/**
 * Componente simple para mostrar el estado de configuración en producción
 */
export function ConfigStatus() {
  const { config, loading, error } = useStoreConfig();

  if (loading) {
    return (
      <View style={statusStyles.container}>
        <Text style={statusStyles.loading}>⏳ Cargando configuración...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[statusStyles.container, statusStyles.error]}>
        <Text style={statusStyles.errorText}>❌ Error de configuración</Text>
        <Text style={statusStyles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={[statusStyles.container, statusStyles.error]}>
        <Text style={statusStyles.errorText}>❌ Sin configuración</Text>
      </View>
    );
  }

  return (
    <View style={[statusStyles.container, statusStyles.success]}>
      <Text style={statusStyles.successText}>✅ {config.business.name}</Text>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 4,
    margin: 4,
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  loading: {
    color: '#6c757d',
    fontSize: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#155724',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#721c24',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetail: {
    color: '#721c24',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});