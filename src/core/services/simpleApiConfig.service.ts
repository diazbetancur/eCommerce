import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../config/env';

interface ApiConfigResponse {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  modules?: {
    [key: string]: boolean;
  };
  subscription?: {
    plan?: string;
    expires?: string;
  };
  branding?: {
    appName?: string;
    logo?: string;
  };
  settings?: {
    [key: string]: any;
  };
}

interface CachedConfig {
  data: ApiConfigResponse;
  timestamp: number;
}

export class SimpleApiConfigService {
  private static readonly CACHE_KEY = 'simple_api_config_cache';
  private static readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas
  private readonly apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || `${APP_CONFIG.apiUrl}/config`;
  }

  /**
   * Obtiene la configuración con cache de 24 horas y fallback
   */
  async getConfig(forceRefresh: boolean = false): Promise<any> {
    console.log('🔧 [SimpleApiConfigService] Obteniendo configuración...');

    try {
      // 1. Verificar cache primero (si no se fuerza refresh)
      if (!forceRefresh) {
        const cachedConfig = await this.getCachedConfig();
        if (cachedConfig) {
          console.log('✅ [SimpleApiConfigService] Usando configuración cacheada');
          return this.mergeWithFallback(cachedConfig);
        }
      }

      // 2. Intentar obtener desde API
      console.log('🌐 [SimpleApiConfigService] Obteniendo desde API...');
      const apiConfig = await this.fetchFromApi();

      if (apiConfig) {
        // 3. Guardar en cache
        await this.saveToCache(apiConfig);
        console.log('💾 [SimpleApiConfigService] Configuración guardada en cache');
        return this.mergeWithFallback(apiConfig);
      }
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error obteniendo configuración:', error);
    }

    // 4. Fallback: Intentar usar cache expirado si existe
    const expiredCache = await this.getExpiredCache();
    if (expiredCache) {
      console.log('🔄 [SimpleApiConfigService] Usando cache expirado como fallback');
      return this.mergeWithFallback(expiredCache);
    }

    // 5. Último recurso: configuración local
    console.log('🏠 [SimpleApiConfigService] Usando configuración local como último recurso');
    return APP_CONFIG;
  }

  /**
   * Obtiene configuración desde la API con timeout
   */
  private async fetchFromApi(): Promise<ApiConfigResponse | null> {
    try {
      // Promise de timeout manual para React Native
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const fetchPromise = fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();
      console.log('📥 [SimpleApiConfigService] Configuración recibida desde API');
      return config;
    } catch (error) {
      console.error('🚫 [SimpleApiConfigService] Error en fetch:', error);
      return null;
    }
  }

  /**
   * Obtiene configuración del cache si es válida (no expirada)
   */
  private async getCachedConfig(): Promise<ApiConfigResponse | null> {
    try {
      const cached = await AsyncStorage.getItem(SimpleApiConfigService.CACHE_KEY);

      if (!cached) {
        return null;
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const now = Date.now();
      const isExpired = now - cachedConfig.timestamp > SimpleApiConfigService.CACHE_DURATION_MS;

      if (isExpired) {
        console.log('⏰ [SimpleApiConfigService] Cache expirado');
        return null;
      }

      const hoursLeft = Math.round(
        (SimpleApiConfigService.CACHE_DURATION_MS - (now - cachedConfig.timestamp)) /
          (60 * 60 * 1000)
      );
      console.log(`✅ [SimpleApiConfigService] Cache válido (expira en ${hoursLeft}h)`);
      return cachedConfig.data;
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error leyendo cache:', error);
      return null;
    }
  }

  /**
   * Obtiene cache expirado como fallback de emergencia
   */
  private async getExpiredCache(): Promise<ApiConfigResponse | null> {
    try {
      const cached = await AsyncStorage.getItem(SimpleApiConfigService.CACHE_KEY);

      if (!cached) {
        return null;
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      console.log('📦 [SimpleApiConfigService] Cache expirado encontrado, usando como fallback');
      return cachedConfig.data;
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error leyendo cache expirado:', error);
      return null;
    }
  }

  /**
   * Guarda configuración en cache con timestamp
   */
  private async saveToCache(config: ApiConfigResponse): Promise<void> {
    try {
      const cachedConfig: CachedConfig = {
        data: config,
        timestamp: Date.now()
      };

      await AsyncStorage.setItem(SimpleApiConfigService.CACHE_KEY, JSON.stringify(cachedConfig));

      console.log('💾 [SimpleApiConfigService] Cache guardado (24h)');
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error guardando cache:', error);
    }
  }

  /**
   * Combina configuración de API con configuración local
   */
  private mergeWithFallback(apiConfig: ApiConfigResponse): any {
    return {
      ...APP_CONFIG,
      ...apiConfig,
      colors: {
        ...APP_CONFIG.colors,
        ...apiConfig.colors
      },
      modules: {
        ...APP_CONFIG.modules,
        ...apiConfig.modules
      },
      subscription: {
        ...APP_CONFIG.subscription,
        ...apiConfig.subscription
      }
    };
  }

  /**
   * Limpia el cache manualmente
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SimpleApiConfigService.CACHE_KEY);
      console.log('🗑️ [SimpleApiConfigService] Cache limpiado');
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error limpiando cache:', error);
    }
  }

  /**
   * Obtiene información del estado del cache
   */
  async getCacheStatus(): Promise<{
    exists: boolean;
    isValid: boolean;
    expiresAt?: Date;
    ageInHours?: number;
  }> {
    try {
      const cached = await AsyncStorage.getItem(SimpleApiConfigService.CACHE_KEY);

      if (!cached) {
        return { exists: false, isValid: false };
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const now = Date.now();
      const age = now - cachedConfig.timestamp;
      const isValid = age <= SimpleApiConfigService.CACHE_DURATION_MS;
      const expiresAt = new Date(cachedConfig.timestamp + SimpleApiConfigService.CACHE_DURATION_MS);
      const ageInHours = Math.round(age / (60 * 60 * 1000));

      return {
        exists: true,
        isValid,
        expiresAt,
        ageInHours
      };
    } catch (error) {
      console.error('❌ [SimpleApiConfigService] Error obteniendo estado de cache:', error);
      return { exists: false, isValid: false };
    }
  }
}
