# 🛡️ ModuleGuard - Control de Renderización por Módulos

Componente para controlar la renderización de funcionalidades basado en la configuración de módulos activos en eCommerce.

## 🚀 Características

✅ **Control Granular**: Renderiza componentes solo si el módulo está activo  
✅ **Módulos Anidados**: Soporte para notación punto (`checkout.paymentCreditCard`)  
✅ **Estados de Loading**: Manejo apropiado mientras se carga la configuración  
✅ **Fallbacks Personalizados**: Componentes alternativos cuando módulos están deshabilitados  
✅ **PropTypes**: Validación completa de props  
✅ **HOC Support**: Higher-Order Component para envolver componentes  
✅ **Hooks Auxiliares**: Para verificar múltiples módulos  
✅ **Debug Mode**: Información de desarrollo para troubleshooting  

## 📦 Estructura de Archivos

```
src/
├── components/
│   ├── ModuleGuard.tsx              # Componente principal
│   └── ModuleGuardExamples.tsx      # Ejemplos de uso
└── core/
    └── providers/
        └── AppProviders.tsx         # Context con configuración de módulos
```

## 🛠️ Props del Componente

```typescript
interface ModuleGuardProps {
  module: string;                    // Nombre del módulo (requerido)
  children: ReactNode;               // Componentes a renderizar (requerido)
  fallback?: ReactNode;              // Componente alternativo
  loadingComponent?: ReactNode;      // Loading personalizado
  showDebugInfo?: boolean;           // Mostrar info de debug
}
```

## 📖 Uso Básico

### 1. Uso Simple

```tsx
import { ModuleGuard } from '../components/ModuleGuard';

function App() {
  return (
    <ModuleGuard module="wishlist">
      <WishlistPage />
    </ModuleGuard>
  );
}
```

### 2. Con Fallback Personalizado

```tsx
<ModuleGuard 
  module="reviews"
  fallback={
    <div className="module-disabled">
      ⚠️ Las reseñas están temporalmente deshabilitadas
    </div>
  }
>
  <ReviewsSection />
</ModuleGuard>
```

### 3. Módulos Anidados

```tsx
<ModuleGuard module="checkout.paymentCreditCard">
  <CreditCardForm />
</ModuleGuard>

<ModuleGuard module="checkout.paymentPaypal">
  <PaypalButton />
</ModuleGuard>
```

### 4. Loading Personalizado

```tsx
<ModuleGuard 
  module="offers"
  loadingComponent={
    <div className="custom-spinner">
      🔄 Verificando ofertas disponibles...
    </div>
  }
>
  <OffersPage />
</ModuleGuard>
```

### 5. Modo Debug

```tsx
<ModuleGuard 
  module="analytics" 
  showDebugInfo={true}
>
  <AnalyticsComponents />
</ModuleGuard>
```

## 🔧 Higher-Order Component (HOC)

### Crear Componentes Protegidos

```tsx
import { withModuleGuard } from '../components/ModuleGuard';

// Componente simple
const ProtectedWishlist = withModuleGuard('wishlist')(WishlistPage);

// Con opciones personalizadas
const ProtectedReviews = withModuleGuard('reviews', {
  fallback: <div>Reseñas no disponibles</div>,
  showDebugInfo: true
})(ReviewsPage);

// Usar en JSX
function App() {
  return (
    <div>
      <ProtectedWishlist />
      <ProtectedReviews />
    </div>
  );
}
```

## 🎣 Hook para Múltiples Módulos

### useMultipleModules

```tsx
import { useMultipleModules } from '../components/ModuleGuard';

function ConditionalFeatures() {
  const { areModulesActive, anyModuleActive, allModulesActive } = useMultipleModules([
    'wishlist', 
    'reviews', 
    'checkout.paymentCreditCard'
  ]);

  if (!anyModuleActive) {
    return <div>No hay funcionalidades disponibles</div>;
  }

  return (
    <div>
      {areModulesActive.wishlist && <WishlistButton />}
      {areModulesActive.reviews && <ReviewsSection />}
      {areModulesActive['checkout.paymentCreditCard'] && <CreditCardForm />}
      
      <div>
        Estado: {allModulesActive ? 'Todas activas' : 'Algunas activas'}
      </div>
    </div>
  );
}
```

### Propiedades del Hook

```typescript
interface UseMultipleModulesReturn {
  areModulesActive: Record<string, boolean>;  // Estado individual de cada módulo
  anyModuleActive: boolean;                   // Al menos uno activo
  allModulesActive: boolean;                  // Todos activos
}
```

## 📋 Componente ModulesList

### Mostrar Estado de Módulos

```tsx
import { ModulesList } from '../components/ModuleGuard';

function AdminPanel() {
  return (
    <div>
      <h2>Estado de Módulos</h2>
      
      {/* Todos los módulos */}
      <ModulesList />
      
      {/* Solo módulos activos */}
      <ModulesList showOnlyActive={true} />
    </div>
  );
}
```

## 🎯 Casos de Uso Prácticos

### 1. eCommerce Features

```tsx
function EcommerceApp() {
  return (
    <div>
      {/* Página principal siempre visible */}
      <ProductCatalog />
      
      {/* Funcionalidades opcionales */}
      <ModuleGuard module="wishlist">
        <WishlistIcon />
      </ModuleGuard>
      
      <ModuleGuard module="reviews">
        <ProductReviews />
      </ModuleGuard>
      
      <ModuleGuard module="offers">
        <SpecialOffersSection />
      </ModuleGuard>
      
      {/* Métodos de pago específicos */}
      <ModuleGuard module="checkout">
        <CheckoutButton />
      </ModuleGuard>
      
      <ModuleGuard module="checkout.paymentCreditCard">
        <CreditCardOption />
      </ModuleGuard>
      
      <ModuleGuard module="checkout.paymentPaypal">
        <PaypalOption />
      </ModuleGuard>
    </div>
  );
}
```

### 2. Navegación Condicional

```tsx
import { useMultipleModules } from '../components/ModuleGuard';

function Navigation() {
  const { areModulesActive } = useMultipleModules([
    'wishlist',
    'orders',
    'loyalty',
    'support'
  ]);

  return (
    <nav>
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/products">Productos</NavLink>
      
      {areModulesActive.wishlist && (
        <NavLink to="/wishlist">Lista de Deseos</NavLink>
      )}
      
      {areModulesActive.orders && (
        <NavLink to="/orders">Mis Pedidos</NavLink>
      )}
      
      {areModulesActive.loyalty && (
        <NavLink to="/loyalty">Programa de Lealtad</NavLink>
      )}
      
      {areModulesActive.support && (
        <NavLink to="/support">Soporte</NavLink>
      )}
    </nav>
  );
}
```

### 3. Formularios Dinámicos

```tsx
function CheckoutForm() {
  return (
    <form>
      <AddressFields />
      
      <ModuleGuard module="checkout.requirePhone">
        <PhoneField required />
      </ModuleGuard>
      
      <ModuleGuard module="checkout.allowGiftMessage">
        <GiftMessageField />
      </ModuleGuard>
      
      <ModuleGuard 
        module="checkout.paymentCreditCard"
        fallback={<div>Solo efectivo disponible</div>}
      >
        <CreditCardFields />
      </ModuleGuard>
      
      <ModuleGuard module="checkout.paymentPaypal">
        <PaypalButton />
      </ModuleGuard>
      
      <SubmitButton />
    </form>
  );
}
```

## 🛡️ Manejo de Errores

### Estados de Error

```tsx
function RobustComponent() {
  return (
    <ModuleGuard 
      module="analytics"
      fallback={
        <div className="feature-unavailable">
          📊 Analytics temporalmente no disponible
        </div>
      }
      loadingComponent={
        <div className="feature-loading">
          ⏳ Verificando permisos de analytics...
        </div>
      }
      showDebugInfo={__DEV__}
    >
      <AnalyticsDashboard />
    </ModuleGuard>
  );
}
```

### Logging y Debug

```typescript
// En desarrollo, ModuleGuard registra automáticamente:
console.log('[ModuleGuard] Módulo "wishlist":', {
  active: true,
  allModules: { wishlist: true, reviews: false, ... }
});
```

## ⚙️ Configuración de Módulos

### Estructura de Configuración

```typescript
// En tu StoreConfig
interface StoreConfig {
  modules: {
    wishlist: boolean;
    reviews: boolean;
    offers: boolean;
    checkout: boolean;
    // O módulos anidados (si tu servicio los soporta)
    // checkout: {
    //   paymentCreditCard: boolean;
    //   paymentPaypal: boolean;
    //   requirePhone: boolean;
    // }
  };
}
```

### Configuración Dinámica

```tsx
// Configurar módulos desde API o configuración
const storeConfig = {
  modules: {
    wishlist: true,
    reviews: false,        // Deshabilitado
    offers: true,
    checkout: true,
    loyalty: false,        // Función premium
    analytics: true
  }
};
```

## 🔄 Flujo de Funcionamiento

```
1. ModuleGuard monta → useStoreConfigContext()
2. Verificar estado: loading, error, config
3. Si loading → Mostrar loadingComponent
4. Si error → Mostrar fallback o null
5. Si config disponible → Verificar módulo
6. Módulo activo → Renderizar children
7. Módulo inactivo → Renderizar fallback o null
8. Background: React Query mantiene config actualizada
```

## 📊 Verificación de Módulos Anidados

### Algoritmo de Verificación

```typescript
function checkModuleActive(modulePath: string): boolean {
  // "wishlist" → modules.wishlist
  if (!modulePath.includes('.')) {
    return modules[modulePath] || false;
  }
  
  // "checkout.paymentCreditCard" → modules.checkout.paymentCreditCard
  const parts = modulePath.split('.');
  let current = modules;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return Boolean(current);
}
```

## 🧪 Testing

### Test de ModuleGuard

```tsx
import { render, screen } from '@testing-library/react';
import { ModuleGuard } from '../ModuleGuard';

// Mock del contexto
const mockConfig = {
  modules: { wishlist: true, reviews: false }
};

test('renderiza children cuando módulo está activo', () => {
  render(
    <TestProvider config={mockConfig}>
      <ModuleGuard module="wishlist">
        <div>Wishlist Content</div>
      </ModuleGuard>
    </TestProvider>
  );
  
  expect(screen.getByText('Wishlist Content')).toBeInTheDocument();
});

test('renderiza fallback cuando módulo está inactivo', () => {
  render(
    <TestProvider config={mockConfig}>
      <ModuleGuard 
        module="reviews" 
        fallback={<div>Reviews Disabled</div>}
      >
        <div>Reviews Content</div>
      </ModuleGuard>
    </TestProvider>
  );
  
  expect(screen.getByText('Reviews Disabled')).toBeInTheDocument();
  expect(screen.queryByText('Reviews Content')).not.toBeInTheDocument();
});
```

## 🚀 Best Practices

### 1. Nombres de Módulos Consistentes

```typescript
// ✅ Bueno: nombres descriptivos
'wishlist'
'reviews'
'checkout.paymentCreditCard'
'analytics.googleAnalytics'

// ❌ Malo: nombres genéricos
'feature1'
'module'
'component'
```

### 2. Fallbacks Informativos

```tsx
// ✅ Bueno: fallback descriptivo
<ModuleGuard 
  module="reviews"
  fallback={
    <div className="feature-notice">
      📝 Las reseñas estarán disponibles próximamente
    </div>
  }
>
  <ReviewsSection />
</ModuleGuard>

// ❌ Malo: sin información al usuario
<ModuleGuard module="reviews">
  <ReviewsSection />
</ModuleGuard>
```

### 3. Agrupación Lógica

```tsx
// ✅ Bueno: agrupar funcionalidades relacionadas
function PaymentOptions() {
  return (
    <ModuleGuard module="checkout">
      <div>
        <ModuleGuard module="checkout.paymentCreditCard">
          <CreditCardOption />
        </ModuleGuard>
        
        <ModuleGuard module="checkout.paymentPaypal">
          <PaypalOption />
        </ModuleGuard>
      </div>
    </ModuleGuard>
  );
}
```

### 4. Performance

```tsx
// ✅ Bueno: usar useMultipleModules para verificaciones múltiples
const { areModulesActive } = useMultipleModules(['a', 'b', 'c']);

// ❌ Malo: múltiples ModuleGuard anidados innecesarios
<ModuleGuard module="a">
  <ModuleGuard module="b">
    <ModuleGuard module="c">
      <Component />
    </ModuleGuard>
  </ModuleGuard>
</ModuleGuard>
```

---

¡Tu ModuleGuard está listo para controlar funcionalidades dinámicamente! 🎉

**Ventajas principales:**
- 🎯 Control granular de funcionalidades
- 🔧 Fácil mantenimiento y configuración
- 🛡️ Manejo robusto de estados de error
- 📱 Optimizado para React Native y Web
- 🎨 Fallbacks personalizables
- 🔍 Herramientas de debug integradas