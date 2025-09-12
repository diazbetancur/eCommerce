# CSS Variables Dinámicas - Actualización del Sistema

## 🎨 Nuevas Variables CSS Implementadas

El hook `useBranding` ahora aplica automáticamente las siguientes variables CSS al `document.documentElement` cuando la configuración se carga o cambia:

### Variables Principales (Nuevas)
```css
--primary-color: #FF3366      /* branding.primaryColor */
--secondary-color: #3366FF    /* branding.secondaryColor */
--accent-color: #33FF66       /* branding.accentColor */
--font-family: 'Roboto, Arial, sans-serif'  /* branding.fontFamily o 'Arial' por defecto */
--border-radius: 12px         /* branding.borderRadius o '8px' por defecto */
```

### Variables Adicionales (Compatibilidad)
```css
--color-primary: #FF3366      /* Igual que --primary-color */
--color-secondary: #3366FF    /* Igual que --secondary-color */
--color-accent: #33FF66       /* Igual que --accent-color */
--color-primary-light: #FF5577
--color-primary-dark: #CC1144
--color-secondary-light: #5577FF
--color-secondary-dark: #1144CC
```

## 🔄 Funcionamiento Automático

### Aplicación Automática
Las variables CSS se aplican automáticamente cuando:
1. **Se carga la configuración inicial**
2. **Cambia la configuración** (actualizaciones en tiempo real)
3. **Se llama manualmente a `applyTheme()`**

### Ejemplo de Configuración
```typescript
// En storeConfig.service.ts
interface StoreConfig {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily?: string;        // Nuevo - opcional
    borderRadius?: string;      // Nuevo - opcional
    logoUrl: string;
  };
  // ... resto de la configuración
}
```

## 💡 Uso en Componentes

### 1. Hook useBranding
```jsx
import { useBranding } from '../core/hooks/useBranding';

function MyComponent() {
  const { colors, applyTheme, resetTheme } = useBranding();
  
  // Las variables CSS ya están aplicadas automáticamente
  return (
    <div className="mi-componente">
      <button onClick={applyTheme}>Reaplicar Tema</button>
      <button onClick={resetTheme}>Resetear Tema</button>
    </div>
  );
}
```

### 2. CSS/SCSS
```css
.mi-boton {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  border: 2px solid var(--accent-color);
  transition: all 0.3s ease;
}

.mi-boton:hover {
  background-color: var(--color-primary-light);
}

.mi-card {
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gradient-background {
  background: linear-gradient(
    135deg, 
    var(--primary-color), 
    var(--accent-color)
  );
}
```

### 3. Styled Components
```jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  padding: 12px 24px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-primary-light);
  }
`;

const StyledCard = styled.div`
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  background: white;
  padding: 20px;
  font-family: var(--font-family);
`;
```

## 🔧 Configuración Avanzada

### Valores por Defecto
```typescript
// En DEFAULT_CONFIG
branding: {
  primaryColor: '#000000',
  secondaryColor: '#666666',
  accentColor: '#007bff',
  logoUrl: '',
  fontFamily: 'Arial',           // Valor por defecto
  borderRadius: '8px'            // Valor por defecto
}
```

### Configuración Mock
```typescript
// En getMockConfig()
branding: {
  primaryColor: '#FF3366',
  secondaryColor: '#3366FF',
  accentColor: '#33FF66',
  logoUrl: 'https://via.placeholder.com/200x80',
  fontFamily: 'Roboto, Arial, sans-serif',
  borderRadius: '12px'
}
```

## 📱 Compatibilidad

### React Web
✅ Totalmente compatible - Las variables CSS se aplican al DOM

### React Native
✅ Compatible con React Native Web
⚠️ Para React Native nativo, usar los valores del hook directamente

```jsx
// React Native nativo
function MyComponent() {
  const { colors } = useBranding();
  
  return (
    <View style={{
      backgroundColor: colors.primary,
      borderRadius: 8, // Usar valor directo
    }}>
      <Text style={{ fontFamily: 'Arial' }}>Mi texto</Text>
    </View>
  );
}
```

## 🎯 Beneficios

### 1. Theming Dinámico
- Cambios en tiempo real sin recarga
- Consistencia visual automática
- Fácil implementación de dark mode

### 2. Mantenibilidad
- Un solo lugar para colores globales
- Reutilización automática en CSS
- Menos código duplicado

### 3. Performance
- No re-renderizado de componentes
- Cambios a nivel CSS nativo
- Transiciones suaves

## 🛠️ Debugging

### Console Logs
El hook registra en consola cuando aplica variables:
```
🎨 [useBranding] CSS variables aplicadas: {
  primary: "#FF3366",
  secondary: "#3366FF", 
  accent: "#33FF66",
  fontFamily: "Roboto, Arial, sans-serif",
  borderRadius: "12px",
  currency: "COP",
  logo: "https://via.placeholder.com/200x80"
}
```

### DevTools
Inspecciona las variables en DevTools:
```
:root {
  --primary-color: #FF3366;
  --secondary-color: #3366FF;
  --accent-color: #33FF66;
  --font-family: Roboto, Arial, sans-serif;
  --border-radius: 12px;
  /* ... más variables */
}
```

## 📋 Lista de Variables Completa

### Variables Principales
- `--primary-color`
- `--secondary-color` 
- `--accent-color`
- `--font-family`
- `--border-radius`

### Variables de Compatibilidad
- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-primary-light`
- `--color-primary-dark`
- `--color-secondary-light`
- `--color-secondary-dark`

### Variables Adicionales
- `--color-primary-10` (10% opacity)
- `--color-primary-20` (20% opacity)
- `--color-primary-50` (50% opacity)
- `--color-accent-light`
- `--color-accent-dark`
- `--currency-symbol`
- `--currency-code`
- `--currency-decimals`
- `--logo-url`

## 🚀 Migración

### Para proyectos existentes:
1. Las variables anteriores (`--color-*`) siguen funcionando
2. Se recomienda migrar a las nuevas (`--primary-color`, etc.)
3. Los valores por defecto se aplican automáticamente

### Ejemplo de migración:
```css
/* Antes */
.mi-boton {
  background-color: var(--color-primary);
}

/* Después (recomendado) */
.mi-boton {
  background-color: var(--primary-color);
  font-family: var(--font-family);
  border-radius: var(--border-radius);
}
```

## ✅ Conclusión

La implementación de CSS variables dinámicas proporciona:
- **Theming automático** sin configuración adicional
- **Valores por defecto** sensatos para todas las variables
- **Compatibilidad completa** con sistemas existentes
- **Performance optimizada** con cambios a nivel CSS
- **Developer experience mejorada** con debugging incluido

Las variables se aplican automáticamente al cargar o cambiar la configuración, proporcionando un sistema de theming robusto y fácil de usar.