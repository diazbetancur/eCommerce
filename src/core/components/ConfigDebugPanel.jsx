import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApiConfig } from '../hooks/useApiConfig';

export default function ConfigDebugPanel() {
  const { config, loading, error, refreshConfig, clearCache, cacheInfo } = useApiConfig();

  const handleRefreshConfig = async () => {
    try {
      await refreshConfig();
      Alert.alert('✅ Éxito', 'Configuración actualizada desde API');
    } catch (err) {
      Alert.alert('❌ Error', 'No se pudo actualizar la configuración');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      '🗑️ Limpiar Cache',
      '¿Estás seguro de que quieres limpiar el cache de configuración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCache();
              Alert.alert('✅ Éxito', 'Cache limpiado y configuración recargada');
            } catch (err) {
              Alert.alert('❌ Error', 'No se pudo limpiar el cache');
            }
          }
        }
      ]
    );
  };

  const handleShowConfig = () => {
    Alert.alert(
      '⚙️ Configuración Actual',
      JSON.stringify(config, null, 2),
      [{ text: 'OK' }]
    );
  };

  if (!__DEV__) {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Config Debug Panel</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Status: {loading ? '⏳ Cargando...' : error ? '❌ Error' : '✅ OK'}
        </Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
        {cacheInfo && (
          <Text style={styles.infoText}>
            Cache: {cacheInfo.exists ? '💾 Activo' : '🚫 Vacío'}
            {cacheInfo.expiresAt && ` (expira: ${cacheInfo.expiresAt.toLocaleTimeString()})`}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRefreshConfig}>
          <Text style={styles.buttonText}>🔄 Refrescar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleClearCache}>
          <Text style={styles.buttonText}>🗑️ Limpiar Cache</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleShowConfig}>
          <Text style={styles.buttonText}>👁️ Ver Config</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
    minWidth: 200,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 12,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 10,
    marginBottom: 2,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 10,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 4,
    flex: 1,
    minWidth: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
});