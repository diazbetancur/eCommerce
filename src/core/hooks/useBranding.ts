import { useCallback, useEffect, useMemo } from 'react';
import { useStoreConfigContext } from '../context/StoreConfigContext';

// Interfaz para la configuración de formateo de moneda
interface CurrencyFormatOptions {
  showSymbol?: boolean;
  showCode?: boolean;
  useGrouping?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Interfaz para los colores del branding
interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
  primaryLight: string;
  primaryDark: string;
  secondaryLight: string;
  secondaryDark: string;
}

// Interfaz del hook useBranding
interface UseBrandingReturn {
  // Colores
  colors: BrandingColors;

  // Logo
  logo: string;

  // Formateo de precios
  formatPrice: (amount: number, options?: CurrencyFormatOptions) => string;
  formatCurrency: (amount: number, options?: CurrencyFormatOptions) => string;

  // Información de moneda
  currency: {
    code: string;
    symbol: string;
    decimalPlaces: number;
  };

  // Estado
  loading: boolean;
  error: Error | null;
  isDefaultConfig: boolean;

  // Métodos de utilidad
  applyTheme: () => void;
  resetTheme: () => void;
  getColorVariations: (baseColor: string) => {
    light: string;
    dark: string;
    lighter: string;
    darker: string;
  };
}

/**
 * Hook useBranding para eCommerce
 *
 * Proporciona funcionalidades completas de branding incluyendo:
 * - CSS variables dinámicas
 * - Formateo de precios y moneda
 * - Colores y logo actuales
 * - Actualizaciones automáticas
 * - Fallbacks a valores por defecto
 *
 * @example
 * ```tsx
 * function ProductCard({ price }) {
 *   const { formatPrice, colors, logo } = useBranding();
 *
 *   return (
 *     <div style={{ borderColor: colors.primary }}>
 *       <img src={logo} alt="Logo" />
 *       <span style={{ color: colors.accent }}>
 *         {formatPrice(price)}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBranding(): UseBrandingReturn {
  const { config, loading, error, isDefaultConfig } = useStoreConfigContext();

  // Memoizar colores para evitar recálculos innecesarios
  const colors = useMemo((): BrandingColors => {
    const { branding } = config;

    return {
      primary: branding.primaryColor,
      secondary: branding.secondaryColor,
      accent: branding.accentColor,
      primaryLight: lightenColor(branding.primaryColor, 20),
      primaryDark: darkenColor(branding.primaryColor, 20),
      secondaryLight: lightenColor(branding.secondaryColor, 20),
      secondaryDark: darkenColor(branding.secondaryColor, 20)
    };
  }, [config.branding]);

  // Aplicar CSS variables dinámicas al document element
  const applyTheme = useCallback(() => {
    if (typeof document === 'undefined') return; // SSR safety

    const root = document.documentElement;
    const { branding, currency } = config;

    // Variables específicas solicitadas
    root.style.setProperty('--primary-color', branding.primaryColor);
    root.style.setProperty('--secondary-color', branding.secondaryColor);
    root.style.setProperty('--accent-color', branding.accentColor);
    root.style.setProperty('--font-family', branding.fontFamily || 'Arial');
    root.style.setProperty('--border-radius', branding.borderRadius || '8px');

    // Variables adicionales para compatibilidad
    root.style.setProperty('--color-primary', branding.primaryColor);
    root.style.setProperty('--color-secondary', branding.secondaryColor);
    root.style.setProperty('--color-accent', branding.accentColor);

    // Aplicar variaciones de colores
    root.style.setProperty('--color-primary-light', colors.primaryLight);
    root.style.setProperty('--color-primary-dark', colors.primaryDark);
    root.style.setProperty('--color-secondary-light', colors.secondaryLight);
    root.style.setProperty('--color-secondary-dark', colors.secondaryDark);

    // Variables adicionales útiles
    root.style.setProperty('--color-primary-10', addOpacity(branding.primaryColor, 0.1));
    root.style.setProperty('--color-primary-20', addOpacity(branding.primaryColor, 0.2));
    root.style.setProperty('--color-primary-50', addOpacity(branding.primaryColor, 0.5));
    root.style.setProperty('--color-accent-light', lightenColor(branding.accentColor, 30));
    root.style.setProperty('--color-accent-dark', darkenColor(branding.accentColor, 30));

    // Variables de moneda
    root.style.setProperty('--currency-symbol', '"' + currency.symbol + '"');
    root.style.setProperty('--currency-code', '"' + currency.code + '"');
    root.style.setProperty('--currency-decimals', currency.decimalPlaces.toString());

    // Variables de logo
    if (branding.logoUrl) {
      root.style.setProperty('--logo-url', 'url("' + branding.logoUrl + '")');
    }

    console.log('🎨 [useBranding] CSS variables aplicadas:', {
      primary: branding.primaryColor,
      secondary: branding.secondaryColor,
      accent: branding.accentColor,
      fontFamily: branding.fontFamily || 'Arial',
      borderRadius: branding.borderRadius || '8px',
      currency: currency.code,
      logo: branding.logoUrl || 'No logo'
    });
  }, [config, colors]);

  // Resetear tema a valores por defecto
  const resetTheme = useCallback(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const propertiesToReset = [
      '--color-primary',
      '--color-secondary',
      '--color-accent',
      '--color-primary-light',
      '--color-primary-dark',
      '--color-secondary-light',
      '--color-secondary-dark',
      '--color-primary-10',
      '--color-primary-20',
      '--color-primary-50',
      '--color-accent-light',
      '--color-accent-dark',
      '--currency-symbol',
      '--currency-code',
      '--currency-decimals',
      '--logo-url'
    ];

    propertiesToReset.forEach((property) => {
      root.style.removeProperty(property);
    });

    console.log('🔄 [useBranding] CSS variables reseteadas');
  }, []);

  // Aplicar tema automáticamente cuando cambie la configuración
  useEffect(() => {
    applyTheme();

    // Cleanup: resetear tema al desmontar (opcional)
    return () => {
      // Solo resetear en desarrollo para evitar problemas
      if (process.env.NODE_ENV === 'development') {
        // Comentado para evitar problemas de cleanup
      }
    };
  }, [applyTheme]);

  // Función para formatear precios con configuración avanzada
  const formatPrice = useCallback(
    (amount: number, options: CurrencyFormatOptions = {}): string => {
      const {
        showSymbol = true,
        showCode = false,
        useGrouping = true,
        minimumFractionDigits,
        maximumFractionDigits
      } = options;

      const { currency } = config;

      try {
        // Usar Intl.NumberFormat para formateo nativo
        const formatter = new Intl.NumberFormat('en-US', {
          style: showSymbol ? 'currency' : 'decimal',
          currency: currency.code,
          currencyDisplay: 'symbol',
          useGrouping,
          minimumFractionDigits: minimumFractionDigits ?? currency.decimalPlaces,
          maximumFractionDigits: maximumFractionDigits ?? currency.decimalPlaces
        });

        let formatted = formatter.format(amount);

        // Si no queremos el símbolo pero Intl lo incluyó, removerlo
        if (!showSymbol && showSymbol !== false) {
          formatted = formatted.replace(/[^\d.,\s-]/g, '').trim();
        }

        // Agregar código de moneda si se solicita
        if (showCode) {
          formatted = formatted + ' ' + currency.code;
        }

        return formatted;
      } catch (error) {
        console.warn('[useBranding] Error formateando precio, usando fallback:', error);

        // Fallback manual si Intl falla
        const decimals = minimumFractionDigits ?? currency.decimalPlaces;
        let formatted = amount.toFixed(decimals);

        if (useGrouping) {
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          formatted = parts.join('.');
        }

        if (showSymbol) {
          formatted = currency.symbol + formatted;
        }

        if (showCode) {
          formatted = formatted + ' ' + currency.code;
        }

        return formatted;
      }
    },
    [config.currency]
  );

  // Alias para formatCurrency (misma funcionalidad)
  const formatCurrency = formatPrice;

  // Función para obtener variaciones de color
  const getColorVariations = useCallback(
    (baseColor: string) => ({
      light: lightenColor(baseColor, 20),
      dark: darkenColor(baseColor, 20),
      lighter: lightenColor(baseColor, 40),
      darker: darkenColor(baseColor, 40)
    }),
    []
  );

  return {
    // Colores
    colors,

    // Logo
    logo: config.branding.logoUrl,

    // Formateo
    formatPrice,
    formatCurrency,

    // Moneda
    currency: config.currency,

    // Estado
    loading,
    error,
    isDefaultConfig,

    // Métodos
    applyTheme,
    resetTheme,
    getColorVariations
  };
}

// Funciones helper para manipular colores (mejoradas)

/**
 * Aclara un color hex
 */
function lightenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;

    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}

/**
 * Oscurece un color hex
 */
function darkenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;

    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}

/**
 * Agrega opacidad a un color hex
 */
function addOpacity(hex: string, opacity: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const R = num >> 16;
    const G = (num >> 8) & 0x00ff;
    const B = num & 0x0000ff;

    return `rgba(${R}, ${G}, ${B}, ${opacity})`;
  } catch {
    return hex;
  }
}

/**
 * Hook para obtener solo el formateo de precios (hook ligero)
 */
export function usePriceFormatter() {
  const { formatPrice, formatCurrency, currency, loading } = useBranding();

  return {
    formatPrice,
    formatCurrency,
    currency,
    loading
  };
}

/**
 * Hook para obtener solo los colores (hook ligero)
 */
export function useColors() {
  const { colors, loading, error } = useBranding();

  return {
    colors,
    loading,
    error
  };
}

/**
 * Hook para obtener solo el logo (hook ligero)
 */
export function useLogo() {
  const { logo, loading, error } = useBranding();

  return {
    logo,
    loading,
    error,
    hasLogo: Boolean(logo)
  };
}
