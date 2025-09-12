import { useMemo } from 'react';
import BaseColors from '../../assets/Colors';
import { useStoreBranding } from './useStoreConfig';

/**
 * Hook que combina colores base con la configuración de branding de la tienda
 * Mantiene colores fallback si no hay configuración disponible
 */
export function useColors() {
  const { branding, loading, error } = useStoreBranding();

  const colors = useMemo(() => {
    // Colores base siempre disponibles
    const baseColors = {
      // Colores estáticos del sistema
      WHITE: '#FFFFFF',
      BLACK: '#000000',
      GRAY_LIGHT: '#F3F4F6',
      GRAY_DARK: '#4B5563',
      GRAY_MEDIUM: '#9CA3AF',

      // Estados
      SUCCESS: '#10B981',
      ERROR: '#EF4444',
      WARNING: '#F59E0B',
      INFO: '#3B82F6',

      // Transparencias
      OVERLAY: 'rgba(0, 0, 0, 0.5)',
      BACKDROP: 'rgba(0, 0, 0, 0.3)',

      // Compatibilidad con código existente
      BLUE: '#3B82F6' // Fallback para Colors.BLUE
    };

    // Si tenemos configuración de branding, la aplicamos
    if (branding && !error) {
      return {
        ...baseColors,

        // Colores principales de la tienda
        PRIMARY: branding.primaryColor || BaseColors.PRIMARY || '#3B82F6',
        SECONDARY: branding.secondaryColor || BaseColors.SECONDARY || '#F59E0B',
        ACCENT: branding.accentColor || '#8B5CF6',

        // Variaciones del color primario
        PRIMARY_LIGHT: lightenColor(branding.primaryColor || '#3B82F6', 20),
        PRIMARY_DARK: darkenColor(branding.primaryColor || '#3B82F6', 20),

        // Variaciones del color secundario
        SECONDARY_LIGHT: lightenColor(branding.secondaryColor || '#F59E0B', 20),
        SECONDARY_DARK: darkenColor(branding.secondaryColor || '#F59E0B', 20),

        // Fondos y bordes (valores por defecto)
        BACKGROUND: '#FFFFFF',
        SURFACE: '#F9FAFB',
        BORDER: '#E5E7EB',

        // Texto (valores por defecto)
        TEXT_PRIMARY: '#111827',
        TEXT_SECONDARY: '#6B7280',
        TEXT_MUTED: '#9CA3AF',

        // Estados con colores de la tienda
        BUTTON_PRIMARY: branding.primaryColor || '#3B82F6',
        BUTTON_SECONDARY: branding.secondaryColor || '#F59E0B',
        BUTTON_DISABLED: '#D1D5DB',

        // Compatibilidad hacia atrás
        BLUE: branding.primaryColor || BaseColors.PRIMARY || '#3B82F6'
      };
    }

    // Fallback a colores base si no hay configuración
    return {
      ...baseColors,
      PRIMARY: BaseColors.PRIMARY || '#3B82F6',
      SECONDARY: BaseColors.SECONDARY || '#F59E0B',
      BLUE: BaseColors.PRIMARY || '#3B82F6',

      // Colores por defecto
      ACCENT: '#8B5CF6',
      BACKGROUND: '#FFFFFF',
      SURFACE: '#F9FAFB',
      BORDER: '#E5E7EB',
      TEXT_PRIMARY: '#111827',
      TEXT_SECONDARY: '#6B7280',
      TEXT_MUTED: '#9CA3AF',

      // Variaciones
      PRIMARY_LIGHT: '#60A5FA',
      PRIMARY_DARK: '#1D4ED8',
      SECONDARY_LIGHT: '#FCD34D',
      SECONDARY_DARK: '#D97706',

      // Botones
      BUTTON_PRIMARY: BaseColors.PRIMARY || '#3B82F6',
      BUTTON_SECONDARY: BaseColors.SECONDARY || '#F59E0B',
      BUTTON_DISABLED: '#D1D5DB'
    };
  }, [branding, error]);

  return {
    colors,
    loading,
    error,
    hasBranding: !!branding && !error
  };
}

/**
 * Función helper para aclarar un color hex
 */
function lightenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;

    // Clamp values between 0 and 255
    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}

/**
 * Función helper para oscurecer un color hex
 */
function darkenColor(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;

    // Clamp values between 0 and 255
    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch {
    return hex;
  }
}

/**
 * Hook para obtener el tema completo (colores + tipografía)
 */
export function useTheme() {
  const { colors, loading, error, hasBranding } = useColors();
  const { branding } = useStoreBranding();

  const theme = useMemo(
    () => ({
      colors,
      typography: {
        fontFamily: 'System', // branding?.fontFamily no está disponible
        fontSize: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        full: 9999
      },
      shadows: {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1
        },
        md: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        },
        lg: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5
        }
      }
    }),
    [colors, branding]
  );

  return {
    theme,
    loading,
    error,
    hasBranding
  };
}
