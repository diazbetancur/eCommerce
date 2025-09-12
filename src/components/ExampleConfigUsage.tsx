import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors, useTheme } from '../core/hooks/useColors';
import { useStoreConfig, useStoreCurrency, useStoreModules } from '../core/hooks/useStoreConfig';
import { ConfigDebugPanel, ConfigStatus } from './ConfigDebugPanel';

/**
 * Componente de ejemplo que demuestra cómo usar los servicios de configuración
 */
export function ExampleConfigUsage() {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { config, loading, error } = useStoreConfig();
  const { formatPrice } = useStoreCurrency();
  const { isModuleEnabled } = useStoreModules();
  const { colors, hasBranding } = useColors();
  const { theme } = useTheme();

  const handleShowInfo = () => {
    if (!config) {
      Alert.alert('Error', 'No hay configuración disponible');
      return;
    }

    Alert.alert(
      'Información de la Tienda',
      `Tienda: ${config.business.name}\n` +
        `Descripción: ${config.business.description}\n` +
        `Color principal: ${config.branding.primaryColor}\n` +
        `Módulo de ofertas: ${isModuleEnabled('offers') ? 'Habilitado' : 'Deshabilitado'}\n` +
        `Precio ejemplo: ${formatPrice(99.99)}`
    );
  };

  const styles = createStyles(colors, theme);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>⏳ Cargando configuración...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Estado de configuración */}
      <ConfigStatus />

      {/* Información de la tienda */}
      {config && (
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{config.business.name}</Text>
          <Text style={styles.storeDescription}>{config.business.description}</Text>

          {/* Indicador de branding dinámico */}
          <View style={styles.brandingIndicator}>
            <Text style={styles.brandingText}>
              {hasBranding ? '🎨 Branding personalizado activo' : '🎨 Usando colores por defecto'}
            </Text>
          </View>
        </View>
      )}

      {/* Botones de ejemplo */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleShowInfo}>
          <Text style={styles.primaryButtonText}>📋 Mostrar Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowDebugPanel(!showDebugPanel)}
        >
          <Text style={styles.secondaryButtonText}>
            {showDebugPanel ? '❌ Ocultar Debug' : '🔧 Mostrar Debug'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ejemplo de módulos habilitados */}
      {config && (
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Módulos Habilitados:</Text>
          {Object.entries(config.modules).map(([moduleName, enabled]) => (
            <View key={moduleName} style={styles.moduleItem}>
              <Text style={styles.moduleText}>
                {enabled ? '✅' : '❌'} {moduleName}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Ejemplo de precios */}
      <View style={styles.pricesContainer}>
        <Text style={styles.pricesTitle}>Ejemplos de Precios:</Text>
        <Text style={styles.priceText}>Producto básico: {formatPrice(19.99)}</Text>
        <Text style={styles.priceText}>Producto premium: {formatPrice(49.99)}</Text>
        <Text style={styles.priceText}>Producto deluxe: {formatPrice(99.99)}</Text>
      </View>

      {/* Panel de debug */}
      {showDebugPanel && (
        <ConfigDebugPanel visible={showDebugPanel} onClose={() => setShowDebugPanel(false)} />
      )}
    </View>
  );
}

/**
 * Función para crear estilos dinámicos basados en la configuración
 */
function createStyles(colors: any, theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: colors.BACKGROUND
    },
    loadingText: {
      textAlign: 'center',
      fontSize: theme.typography.fontSize.lg,
      color: colors.TEXT_SECONDARY,
      marginTop: theme.spacing.xl
    },
    errorText: {
      textAlign: 'center',
      fontSize: theme.typography.fontSize.base,
      color: colors.ERROR,
      marginBottom: theme.spacing.md
    },
    retryButton: {
      backgroundColor: colors.PRIMARY,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center'
    },
    retryButtonText: {
      color: colors.WHITE,
      fontWeight: theme.typography.fontWeight.semibold
    },
    storeInfo: {
      backgroundColor: colors.SURFACE,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm
    },
    storeName: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: colors.PRIMARY,
      marginBottom: theme.spacing.xs
    },
    storeDescription: {
      fontSize: theme.typography.fontSize.base,
      color: colors.TEXT_SECONDARY,
      lineHeight: 20
    },
    brandingIndicator: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: colors.PRIMARY_LIGHT + '20',
      borderRadius: theme.borderRadius.sm
    },
    brandingText: {
      fontSize: theme.typography.fontSize.sm,
      color: colors.PRIMARY,
      fontWeight: theme.typography.fontWeight.medium
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.PRIMARY,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      ...theme.shadows.sm
    },
    primaryButtonText: {
      color: colors.WHITE,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: colors.SECONDARY,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      ...theme.shadows.sm
    },
    secondaryButtonText: {
      color: colors.WHITE,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold
    },
    modulesContainer: {
      backgroundColor: colors.SURFACE,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm
    },
    modulesTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: colors.TEXT_PRIMARY,
      marginBottom: theme.spacing.sm
    },
    moduleItem: {
      paddingVertical: theme.spacing.xs
    },
    moduleText: {
      fontSize: theme.typography.fontSize.base,
      color: colors.TEXT_SECONDARY
    },
    pricesContainer: {
      backgroundColor: colors.SURFACE,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm
    },
    pricesTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: colors.TEXT_PRIMARY,
      marginBottom: theme.spacing.sm
    },
    priceText: {
      fontSize: theme.typography.fontSize.base,
      color: colors.ACCENT,
      fontWeight: theme.typography.fontWeight.medium,
      marginBottom: theme.spacing.xs
    }
  });
}
