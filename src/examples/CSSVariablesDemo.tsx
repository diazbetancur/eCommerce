import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBranding } from '../core/hooks/useBranding';

/**
 * Ejemplo demonstrando las nuevas CSS variables dinámicas
 * Muestra cómo se aplican automáticamente las variables CSS al document.documentElement
 */

const CSSVariablesDemo: React.FC = () => {
  const { colors, loading, applyTheme, resetTheme } = useBranding();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demo CSS Variables Dinámicas</Text>

      <Text style={styles.subtitle}>Variables aplicadas automáticamente:</Text>

      <View style={styles.variablesContainer}>
        <Text style={styles.variableItem}>--primary-color: {colors.primary}</Text>
        <Text style={styles.variableItem}>--secondary-color: {colors.secondary}</Text>
        <Text style={styles.variableItem}>--accent-color: {colors.accent}</Text>
        <Text style={styles.variableItem}>
          --font-family: Roboto, Arial, sans-serif (por defecto)
        </Text>
        <Text style={styles.variableItem}>--border-radius: 8px (por defecto)</Text>
      </View>

      <Text style={styles.subtitle}>Ejemplo de uso en CSS:</Text>

      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>
          {`.mi-boton {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  border: 2px solid var(--accent-color);
}

.mi-card {
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  background: linear-gradient(
    135deg, 
    var(--primary-color), 
    var(--accent-color)
  );
}`}
        </Text>
      </View>

      <Text style={styles.subtitle}>Demostración visual:</Text>

      <View style={[styles.demoCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.demoCardTitle}>Card con Primary Color</Text>
        <Text style={styles.demoCardText}>Este card usa el color primario dinámico</Text>
      </View>

      <View style={[styles.demoCard, { backgroundColor: colors.secondary }]}>
        <Text style={styles.demoCardTitle}>Card con Secondary Color</Text>
        <Text style={styles.demoCardText}>Este card usa el color secundario dinámico</Text>
      </View>

      <View style={[styles.demoCard, { backgroundColor: colors.accent }]}>
        <Text style={styles.demoCardTitle}>Card con Accent Color</Text>
        <Text style={styles.demoCardText}>Este card usa el color accent dinámico</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={[styles.button, styles.primaryButton]} onPress={applyTheme}>
          Aplicar Tema Actual
        </Text>
        <Text style={[styles.button, styles.secondaryButton]} onPress={resetTheme}>
          Resetear Tema
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📝 Información:</Text>
        <Text style={styles.infoText}>
          • Las variables CSS se aplican automáticamente al cargar la configuración
        </Text>
        <Text style={styles.infoText}>
          • Los cambios en la configuración actualizan las variables dinámicamente
        </Text>
        <Text style={styles.infoText}>
          • Se incluyen valores por defecto cuando no están especificados
        </Text>
        <Text style={styles.infoText}>• Funciona tanto en React como en React Native Web</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 20,
    marginBottom: 10
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50
  },
  variablesContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  variableItem: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#2c3e50',
    marginBottom: 5,
    paddingVertical: 3
  },
  codeContainer: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ecf0f1',
    lineHeight: 18
  },
  demoCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  demoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  demoCardText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: '#ffffff'
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
    color: '#ffffff'
  },
  infoContainer: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 20
  }
});

export default CSSVariablesDemo;

// También exportar como ejemplo individual
export { CSSVariablesDemo };
