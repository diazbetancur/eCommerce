# eCommerce Configuration System

A comprehensive React Context-based configuration system for eCommerce applications, built with React Query integration, TypeScript, and dynamic theming capabilities.

## Overview

This system provides:
- **StoreConfigContext**: React Query-powered configuration management
- **ModuleGuard**: Conditional rendering based on feature toggles
- **useBranding**: Dynamic theming and currency formatting hook
- **Complete TypeScript Support**: Full type safety throughout

## Quick Start

```jsx
import React from 'react';
import { AppProviders } from './src/core/providers/AppProviders';
import { useBranding } from './src/core/hooks/useBranding';
import { ModuleGuard } from './src/components/ModuleGuard';

// Wrap your app with providers
function App() {
  return (
    <AppProviders>
      <YourAppContent />
    </AppProviders>
  );
}

// Use in components
function ProductCard({ product }) {
  const { formatPrice, colors } = useBranding();
  
  return (
    <ModuleGuard module="products">
      <div style={{ backgroundColor: colors.primary }}>
        <h3>{product.name}</h3>
        <p>{formatPrice(product.price)}</p>
      </div>
    </ModuleGuard>
  );
}
```

## Components

### 1. StoreConfigContext

The heart of the configuration system, providing React Query-powered state management.

**Features:**
- Automatic caching with 5-minute stale time
- Background refetching every 10 minutes
- CSS variable application for dynamic theming
- Error handling and loading states

**Usage:**
```jsx
import { useStoreConfigContext } from './src/core/context/StoreConfigContext';

function MyComponent() {
  const { config, loading, error, refetch } = useStoreConfigContext();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{config.storeName}</h1>
      <p>Currency: {config.currency.code}</p>
    </div>
  );
}
```

**Configuration Schema:**
```typescript
interface StoreConfig {
  // Store Information
  storeName: string;
  storeDescription: string;
  logo: string;
  
  // Theming
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
  };
  
  // Currency
  currency: {
    code: string;
    symbol: string;
    decimalPlaces: number;
  };
  
  // Feature Modules
  modules: {
    products: boolean;
    cart: boolean;
    checkout: boolean;
    loyalty: boolean;
    reviews: boolean;
    wishlist: boolean;
    recommendations: boolean;
    analytics: boolean;
    notifications: boolean;
    social: boolean;
    inventory: boolean;
    pricing: boolean;
    shipping: boolean;
    payments: boolean;
    admin: boolean;
  };
  
  // Settings
  settings: {
    allowGuestCheckout: boolean;
    requireAccountForPurchase: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
    enableLoyaltyPoints: boolean;
    enableNotifications: boolean;
    enableSocialSharing: boolean;
    autoApplyPromotions: boolean;
    showInventoryCount: boolean;
    enableMultiCurrency: boolean;
    enableTaxCalculation: boolean;
  };
}
```

### 2. ModuleGuard

Conditional rendering component based on module configuration.

**Features:**
- Single and multiple module checking
- Fallback content support
- PropTypes validation
- HOC pattern support
- Custom hooks for module checking

**Basic Usage:**
```jsx
import { ModuleGuard } from './src/components/ModuleGuard';

// Single module
<ModuleGuard module="loyalty">
  <LoyaltyProgram />
</ModuleGuard>

// Multiple modules (ALL must be active)
<ModuleGuard modules={['cart', 'checkout']}>
  <CheckoutFlow />
</ModuleGuard>

// With fallback
<ModuleGuard 
  module="reviews" 
  fallback={<div>Reviews not available</div>}
>
  <ReviewsSection />
</ModuleGuard>
```

**Advanced Usage:**
```jsx
import { 
  useModuleGuard, 
  useMultipleModules,
  withModuleGuard 
} from './src/components/ModuleGuard';

// Hook usage
function MyComponent() {
  const isLoyaltyActive = useModuleGuard('loyalty');
  const { allActive, someActive } = useMultipleModules(['cart', 'wishlist']);
  
  return (
    <div>
      {isLoyaltyActive && <LoyaltyBadge />}
      {allActive && <AdvancedFeatures />}
      {someActive && <PartialFeatures />}
    </div>
  );
}

// HOC usage
const ProtectedComponent = withModuleGuard('admin')(AdminPanel);
```

**Nested Module Support:**
```jsx
// Check multiple levels
<ModuleGuard module="ecommerce.products.reviews">
  <ProductReviews />
</ModuleGuard>

// Works with any nested configuration
<ModuleGuard module="features.advanced.analytics">
  <AdvancedAnalytics />
</ModuleGuard>
```

### 3. useBranding Hook

Comprehensive theming and currency formatting hook.

**Features:**
- Dynamic CSS variable application
- International currency formatting
- Color variations generation
- Theme management
- Loading and error states

**Complete API:**
```jsx
import { useBranding } from './src/core/hooks/useBranding';

function MyComponent() {
  const {
    // Colors (automatically applied as CSS variables)
    colors: {
      primary,
      secondary,
      accent,
      primaryLight,
      primaryDark,
      secondaryLight,
      secondaryDark
    },
    
    // Logo
    logo,
    
    // Currency formatting
    formatPrice,
    formatCurrency,
    currency: { code, symbol, decimalPlaces },
    
    // Utilities
    getColorVariations,
    applyTheme,
    resetTheme,
    
    // State
    loading,
    error,
    isDefaultConfig
  } = useBranding();
  
  return (
    <div style={{ backgroundColor: colors.primary }}>
      <img src={logo} alt="Store Logo" />
      <p>Price: {formatPrice(29.99)}</p>
      <p>With code: {formatPrice(29.99, { showCode: true })}</p>
    </div>
  );
}
```

**Currency Formatting Options:**
```jsx
// Basic formatting
formatPrice(29.99) // → "$29.99"

// With currency code
formatPrice(29.99, { showCode: true }) // → "$29.99 USD"

// Without symbol
formatPrice(29.99, { showSymbol: false, showCode: true }) // → "29.99 USD"

// Custom precision
formatPrice(29.99, { minimumFractionDigits: 3 }) // → "$29.990"

// No grouping
formatPrice(1299.99, { useGrouping: false }) // → "$1299.99"
```

**Color Variations:**
```jsx
const variations = getColorVariations('#3498db');
// Returns: { light: '#...', dark: '#...', lighter: '#...', darker: '#...' }
```

## Advanced Features

### CSS Variables Integration

The system automatically applies CSS variables to `document.documentElement`:

```css
/* Automatically available in your CSS */
:root {
  --store-primary-color: #3498db;
  --store-secondary-color: #2ecc71;
  --store-accent-color: #f1c40f;
  --store-primary-light: #5dade2;
  --store-primary-dark: #2874a6;
  --store-secondary-light: #58d68d;
  --store-secondary-dark: #239b56;
}

/* Use in your styles */
.my-button {
  background-color: var(--store-primary-color);
  border: 1px solid var(--store-primary-dark);
}

.my-button:hover {
  background-color: var(--store-primary-light);
}
```

### React Query Integration

Built-in caching and background updates:

```jsx
// Automatic background refetch every 10 minutes
// Cached for 5 minutes before considering stale
// Automatic error retry with exponential backoff
// Optimistic updates support

function AdminPanel() {
  const { config, refetch, isRefetching } = useStoreConfigContext();
  
  const handleUpdateConfig = async (newConfig) => {
    // Update config and automatically refetch
    await updateStoreConfig(newConfig);
    refetch();
  };
  
  return (
    <div>
      {isRefetching && <Spinner />}
      <ConfigEditor config={config} onSave={handleUpdateConfig} />
    </div>
  );
}
```

### TypeScript Support

Complete type safety throughout:

```typescript
// All interfaces are exported for use in your code
import type { 
  StoreConfig, 
  CurrencyFormatOptions,
  BrandingColors,
  UseBrandingReturn 
} from './src/core/hooks/useBranding';

// Type-safe component props
interface ProductCardProps {
  product: {
    name: string;
    price: number;
  };
  showCurrency?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showCurrency = true }) => {
  const { formatPrice }: UseBrandingReturn = useBranding();
  
  return (
    <div>
      <h3>{product.name}</h3>
      {showCurrency && <p>{formatPrice(product.price)}</p>}
    </div>
  );
};
```

## Installation & Setup

1. **Install Dependencies:**
```bash
npm install @tanstack/react-query prop-types
```

2. **Copy Files:**
```
src/
├── core/
│   ├── context/
│   │   └── StoreConfigContext.tsx
│   ├── hooks/
│   │   └── useBranding.ts
│   └── providers/
│       ├── AppProviders.tsx
│       └── QueryProvider.tsx
├── components/
│   └── ModuleGuard.tsx
└── examples/
    ├── ModuleGuardExamples.tsx
    └── UseBrandingExamples.tsx
```

3. **Implement API Service:**
```typescript
// src/api/storeConfigService.ts
export const fetchStoreConfig = async (): Promise<StoreConfig> => {
  // Your API implementation
  const response = await fetch('/api/store-config');
  return response.json();
};
```

4. **Wrap Your App:**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './src/core/providers/AppProviders';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
```

## Examples

See the complete examples in:
- `src/examples/ModuleGuardExamples.tsx` - All ModuleGuard usage patterns
- `src/examples/UseBrandingExamples.tsx` - Complete useBranding demonstrations

## Error Handling

The system provides comprehensive error handling:

```jsx
function ErrorBoundaryExample() {
  const { error, loading, isDefaultConfig } = useBranding();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        retry={() => window.location.reload()} 
      />
    );
  }
  
  if (isDefaultConfig) {
    return <ConfigurationRequired />;
  }
  
  return <NormalContent />;
}
```

## Performance Considerations

- **React Query Caching**: 5-minute stale time reduces API calls
- **useMemo Optimization**: Context values are memoized
- **CSS Variables**: Efficient theme updates without re-renders
- **Conditional Rendering**: ModuleGuard prevents unnecessary component mounting

## Best Practices

1. **Always wrap your app with AppProviders**
2. **Use ModuleGuard for feature gating**
3. **Leverage useBranding for consistent theming**
4. **Handle loading and error states**
5. **Use TypeScript interfaces for type safety**
6. **Implement proper fallbacks for disabled modules**

## Browser Support

- Modern browsers with CSS Variables support
- React 16.8+ (hooks support)
- TypeScript 4.0+ (optional but recommended)

## Contributing

When extending this system:
1. Maintain TypeScript interfaces
2. Add PropTypes for runtime validation
3. Include comprehensive examples
4. Follow the established patterns
5. Test with error scenarios

## License

This configuration system is part of your eCommerce application and follows your project's licensing terms.