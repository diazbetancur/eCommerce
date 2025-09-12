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
  cacheExpirationHours?: number; // Configuración de cache desde API
}

interface CachedConfig {
  data: ApiConfigResponse;
  timestamp: number;
  expirationHours: number;
}

export class ApiConfigService {
  private static readonly CACHE_KEY = 'api_config_cache';
  private static readonly DEFAULT_CACHE_HOURS = 24;
  private readonly apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || `${APP_CONFIG.apiUrl}/config`;
  }

  /**
   * Obtiene la configuración con cache y fallback
   * @param forceRefresh - Forzar actualización desde API
   * @returns Configuración combinada
   */
  async getConfig(forceRefresh: boolean = false): Promise<any> {
    console.log('🔧 [ApiConfigService] Obteniendo configuración...');

    try {
      // 1. Verificar cache si no se fuerza refresh
      if (!forceRefresh) {
        const cachedConfig = await this.getCachedConfig();
        if (cachedConfig) {
          console.log('✅ [ApiConfigService] Usando configuración cacheada');
          return this.mergeWithFallback(cachedConfig);
        }
      }

      // 2. Obtener desde API
      console.log('🌐 [ApiConfigService] Obteniendo desde API...');
      const apiConfig = await this.fetchFromApi();

      if (apiConfig) {
        // 3. Guardar en cache
        await this.saveToCache(apiConfig);
        console.log('💾 [ApiConfigService] Configuración guardada en cache');
        return this.mergeWithFallback(apiConfig);
      }
    } catch (error) {
      console.error('❌ [ApiConfigService] Error obteniendo configuración:', error);
    }

    // 4. Fallback a configuración local
    console.log('🔄 [ApiConfigService] Usando configuración fallback');
    return APP_CONFIG;
  }

  /**
   * Obtiene configuración desde la API
   */
  private async fetchFromApi(): Promise<ApiConfigResponse | null> {
    try {
      // Crear AbortController para timeout manual
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();
      console.log('📥 [ApiConfigService] Configuración recibida desde API');
      return config;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ [ApiConfigService] Timeout: La API tardó más de 10 segundos');
      } else {
        console.error('🚫 [ApiConfigService] Error en fetch:', error);
      }
      return null;
    }
  }

  /**
   * Obtiene configuración del cache si es válida
   */
  private async getCachedConfig(): Promise<ApiConfigResponse | null> {
    try {
      const cached = await AsyncStorage.getItem(ApiConfigService.CACHE_KEY);

      if (!cached) {
        console.log('ℹ️ [ApiConfigService] No hay configuración cacheada');
        return null;
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const now = Date.now();
      const expirationTime = cachedConfig.timestamp + cachedConfig.expirationHours * 60 * 60 * 1000;

      if (now > expirationTime) {
        console.log('⏰ [ApiConfigService] Cache expirado');
        await AsyncStorage.removeItem(ApiConfigService.CACHE_KEY);
        return null;
      }

      console.log(
        `✅ [ApiConfigService] Cache válido (expira en ${Math.round(
          (expirationTime - now) / (60 * 60 * 1000)
        )}h)`
      );
      return cachedConfig.data;
    } catch (error) {
      console.error('❌ [ApiConfigService] Error leyendo cache:', error);
      return null;
    }
  }

  /**
   * Guarda configuración en cache
   */
  private async saveToCache(config: ApiConfigResponse): Promise<void> {
    try {
      const cacheHours = config.cacheExpirationHours || ApiConfigService.DEFAULT_CACHE_HOURS;

      const cachedConfig: CachedConfig = {
        data: config,
        timestamp: Date.now(),
        expirationHours: cacheHours
      };

      await AsyncStorage.setItem(ApiConfigService.CACHE_KEY, JSON.stringify(cachedConfig));

      console.log(`💾 [ApiConfigService] Cache guardado (${cacheHours}h)`);
    } catch (error) {
      console.error('❌ [ApiConfigService] Error guardando cache:', error);
    }
  }

  /**
   * Combina configuración de API con fallback local
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
      await AsyncStorage.removeItem(ApiConfigService.CACHE_KEY);
      console.log('🗑️ [ApiConfigService] Cache limpiado');
    } catch (error) {
      console.error('❌ [ApiConfigService] Error limpiando cache:', error);
    }
  }

  /**
   * Obtiene información del cache actual
   */
  async getCacheInfo(): Promise<{
    exists: boolean;
    expiresAt?: Date;
    expirationHours?: number;
  } | null> {
    try {
      const cached = await AsyncStorage.getItem(ApiConfigService.CACHE_KEY);

      if (!cached) {
        return { exists: false };
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const expiresAt = new Date(
        cachedConfig.timestamp + cachedConfig.expirationHours * 60 * 60 * 1000
      );

      return {
        exists: true,
        expiresAt,
        expirationHours: cachedConfig.expirationHours
      };
    } catch (error) {
      console.error('❌ [ApiConfigService] Error obteniendo info de cache:', error);
      return null;
    }
  }
}
