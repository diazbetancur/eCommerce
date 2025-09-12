import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ModuleGuard } from '../components/ModuleGuard';
import { useBranding } from '../core/hooks/useBranding';

/**
 * Comprehensive examples demonstrating the useBranding hook usage
 * Shows CSS variables, currency formatting, and color utilities in action
 */

const PriceDisplayExample: React.FC = () => {
  const { formatPrice } = useBranding();

  const products = [
    { name: 'T-Shirt', price: 29.99 },
    { name: 'Jeans', price: 79.5 },
    { name: 'Sneakers', price: 129.0 },
    { name: 'Jacket', price: 199.99 }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Price Formatting Examples</Text>

      <Text style={styles.subtitle}>Default Formatting:</Text>
      {products.map((product) => (
        <Text key={product.name} style={styles.priceItem}>
          {product.name}: {formatPrice(product.price)}
        </Text>
      ))}

      <Text style={styles.subtitle}>With Currency Code:</Text>
      {products.map((product) => (
        <Text key={`${product.name}-code`} style={styles.priceItem}>
          {product.name}: {formatPrice(product.price, { showCode: true })}
        </Text>
      ))}

      <Text style={styles.subtitle}>Without Symbol:</Text>
      {products.map((product) => (
        <Text key={`${product.name}-no-symbol`} style={styles.priceItem}>
          {product.name}: {formatPrice(product.price, { showSymbol: false, showCode: true })}
        </Text>
      ))}

      <Text style={styles.subtitle}>Custom Precision:</Text>
      {products.map((product) => (
        <Text key={`${product.name}-precision`} style={styles.priceItem}>
          {product.name}: {formatPrice(product.price, { minimumFractionDigits: 3 })}
        </Text>
      ))}
    </View>
  );
};

const ColorUtilitiesExample: React.FC = () => {
  const { colors, getColorVariations } = useBranding();

  const baseColor = colors.primary;
  const variations = getColorVariations(baseColor);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Color Utilities Examples</Text>

      <Text style={styles.subtitle}>Primary Color Variations:</Text>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
        <Text style={styles.colorLabel}>Primary: {colors.primary}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: colors.primaryLight }]} />
        <Text style={styles.colorLabel}>Primary Light: {colors.primaryLight}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: colors.primaryDark }]} />
        <Text style={styles.colorLabel}>Primary Dark: {colors.primaryDark}</Text>
      </View>

      <Text style={styles.subtitle}>Generated Variations:</Text>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: variations.light }]} />
        <Text style={styles.colorLabel}>Light: {variations.light}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: variations.lighter }]} />
        <Text style={styles.colorLabel}>Lighter: {variations.lighter}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: variations.dark }]} />
        <Text style={styles.colorLabel}>Dark: {variations.dark}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: variations.darker }]} />
        <Text style={styles.colorLabel}>Darker: {variations.darker}</Text>
      </View>

      <Text style={styles.subtitle}>Secondary Colors:</Text>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: colors.secondary }]} />
        <Text style={styles.colorLabel}>Secondary: {colors.secondary}</Text>
      </View>

      <View style={styles.colorRow}>
        <View style={[styles.colorBox, { backgroundColor: colors.accent }]} />
        <Text style={styles.colorLabel}>Accent: {colors.accent}</Text>
      </View>
    </View>
  );
};

const ThemeManagementExample: React.FC = () => {
  const { colors, applyTheme, resetTheme, loading, error } = useBranding();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Theme Management</Text>

      <Text style={styles.subtitle}>Current Theme Status:</Text>
      <Text style={styles.variableText}>Loading: {loading ? 'Yes' : 'No'}</Text>
      <Text style={styles.variableText}>Error: {error ? error.message : 'None'}</Text>

      <Text style={styles.subtitle}>Current Colors:</Text>
      <Text style={styles.variableText}>Primary: {colors.primary}</Text>
      <Text style={styles.variableText}>Secondary: {colors.secondary}</Text>
      <Text style={styles.variableText}>Accent: {colors.accent}</Text>

      <View style={styles.buttonRow}>
        <Text style={styles.button} onPress={applyTheme}>
          Apply Current Theme
        </Text>
        <Text style={styles.button} onPress={resetTheme}>
          Reset Theme
        </Text>
      </View>
    </View>
  );
};

const BrandingWithModuleGuardExample: React.FC = () => {
  const { formatPrice } = useBranding();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Branding with Module Guard</Text>

      <ModuleGuard module="pricing" fallback={<Text>Pricing module disabled</Text>}>
        <Text style={styles.subtitle}>Premium Product Pricing:</Text>
        <Text style={styles.priceItem}>Premium Plan: {formatPrice(99.99, { showCode: true })}</Text>
        <Text style={styles.priceItem}>
          Enterprise Plan: {formatPrice(299.99, { showCode: true })}
        </Text>
      </ModuleGuard>

      <ModuleGuard module="loyalty" fallback={<Text>Loyalty features not available</Text>}>
        <Text style={styles.subtitle}>Loyalty Points Value:</Text>
        <Text style={styles.priceItem}>1000 points = {formatPrice(10.0)}</Text>
        <Text style={styles.priceItem}>5000 points = {formatPrice(50.0)}</Text>
      </ModuleGuard>
    </View>
  );
};

const CompleteBrandingExample: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>useBranding Hook Examples</Text>

      <PriceDisplayExample />
      <ColorUtilitiesExample />
      <ThemeManagementExample />
      <BrandingWithModuleGuardExample />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50'
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34495e'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#7f8c8d'
  },
  priceItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#2c3e50'
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  colorBox: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  colorLabel: {
    fontSize: 14,
    color: '#2c3e50'
  },
  conversionText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
    color: '#2c3e50'
  },
  variableText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
    color: '#2c3e50'
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12
  },
  button: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 14,
    textAlign: 'center',
    minWidth: 120
  }
});

export default CompleteBrandingExample;

// Export individual examples for modular usage
export {
  BrandingWithModuleGuardExample,
  ColorUtilitiesExample,
  PriceDisplayExample,
  ThemeManagementExample
};
