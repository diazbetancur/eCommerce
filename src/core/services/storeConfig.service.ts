// Servicio de configuración para eCommerce React
// Obtiene configuración desde API con cache y fallbacks

interface StoreConfig {
  storeId: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    fontFamily?: string;
    borderRadius?: string;
  };
  currency: {
    code: string;
    symbol: string;
    decimalPlaces: number;
  };
  modules: {
    checkout: boolean;
    wishlist: boolean;
    reviews: boolean;
    [key: string]: boolean;
  };
  business: {
    name: string;
    contactEmail: string;
    [key: string]: any;
  };
  configVersion: string;
}

interface ApiResponse {
  success: boolean;
  data: StoreConfig;
}

interface CachedConfig {
  data: StoreConfig;
  timestamp: number;
  storeId: string;
}

class StoreConfigService {
  private static readonly CACHE_KEY = 'ecommerce_store_config';
  private static readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas
  private static readonly REQUEST_TIMEOUT_MS = 10000; // 10 segundos

  private readonly apiBaseUrl: string;
  private readonly storeId: string;
  private readonly isDevelopment: boolean;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_CONFIG_API || '';
    this.storeId = process.env.REACT_APP_STORE_ID || '';
    this.isDevelopment = process.env.NODE_ENV === 'development';

    console.log('🔧 [StoreConfigService] Inicializando servicio');
    console.log('🌐 API Base URL:', this.apiBaseUrl);
    console.log('🏪 Store ID:', this.storeId);
    console.log('🛠️ Modo desarrollo:', this.isDevelopment);
  }

  /**
   * Obtiene la configuración de la tienda con cache y fallbacks
   */
  async getStoreConfig(forceRefresh: boolean = false): Promise<StoreConfig> {
    console.log('📋 [StoreConfigService] Obteniendo configuración de tienda...');

    try {
      // 1. Verificar cache si no se fuerza refresh
      if (!forceRefresh) {
        const cachedConfig = this.getCachedConfig();
        if (cachedConfig) {
          console.log('✅ [StoreConfigService] Usando configuración cacheada');
          return cachedConfig;
        }
      }

      // 2. En desarrollo, usar datos mock si no hay API configurada
      if (this.isDevelopment && !this.apiBaseUrl) {
        console.log('🛠️ [StoreConfigService] Usando configuración mock (desarrollo)');
        const mockConfig = this.getMockConfig();
        this.saveToCache(mockConfig);
        return mockConfig;
      }

      // 3. Validar configuración requerida
      this.validateConfig();

      // 4. Obtener desde API
      console.log('🌐 [StoreConfigService] Obteniendo desde API...');
      const apiConfig = await this.fetchFromApi();

      if (apiConfig) {
        // 5. Guardar en cache
        this.saveToCache(apiConfig);
        console.log('💾 [StoreConfigService] Configuración guardada en cache');
        return apiConfig;
      }
    } catch (error) {
      console.error('❌ [StoreConfigService] Error obteniendo configuración:', error);
    }

    // 6. Fallback a cache expirado si existe
    const expiredCache = this.getExpiredCache();
    if (expiredCache) {
      console.log('🔄 [StoreConfigService] Usando cache expirado como fallback');
      return expiredCache;
    }

    // 7. Último recurso: configuración por defecto
    console.log('🏠 [StoreConfigService] Usando configuración por defecto');
    return this.getDefaultConfig();
  }

  /**
   * Obtiene configuración desde la API con timeout
   */
  private async fetchFromApi(): Promise<StoreConfig | null> {
    try {
      const apiUrl = `${this.apiBaseUrl}/stores/${this.storeId}`;

      console.log('📡 [StoreConfigService] Realizando request a:', apiUrl);

      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('⏰ [StoreConfigService] Request timeout después de 10 segundos');
      }, StoreConfigService.REQUEST_TIMEOUT_MS);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData: ApiResponse = await response.json();

      if (!responseData.success || !responseData.data) {
        throw new Error('Respuesta de API inválida');
      }

      console.log('📥 [StoreConfigService] Configuración recibida desde API');
      console.log('🔄 [StoreConfigService] Config version:', responseData.data.configVersion);

      return responseData.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('⏰ [StoreConfigService] Request cancelado por timeout');
        } else {
          console.error('🚫 [StoreConfigService] Error en fetch:', error.message);
        }
      }
      return null;
    }
  }

  /**
   * Obtiene configuración del cache si es válida
   */
  private getCachedConfig(): StoreConfig | null {
    try {
      const cached = localStorage.getItem(StoreConfigService.CACHE_KEY);

      if (!cached) {
        console.log('ℹ️ [StoreConfigService] No hay configuración cacheada');
        return null;
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);

      // Verificar que el cache sea para la misma tienda
      if (cachedConfig.storeId !== this.storeId) {
        console.log('🔄 [StoreConfigService] Cache es para diferente tienda, limpiando...');
        localStorage.removeItem(StoreConfigService.CACHE_KEY);
        return null;
      }

      const now = Date.now();
      const isExpired = now - cachedConfig.timestamp > StoreConfigService.CACHE_DURATION_MS;

      if (isExpired) {
        console.log('⏰ [StoreConfigService] Cache expirado');
        return null;
      }

      const hoursLeft = Math.round(
        (StoreConfigService.CACHE_DURATION_MS - (now - cachedConfig.timestamp)) / (60 * 60 * 1000)
      );
      console.log(`✅ [StoreConfigService] Cache válido (expira en ${hoursLeft}h)`);

      return cachedConfig.data;
    } catch (error) {
      console.error('❌ [StoreConfigService] Error leyendo cache:', error);
      localStorage.removeItem(StoreConfigService.CACHE_KEY);
      return null;
    }
  }

  /**
   * Obtiene cache expirado como fallback de emergencia
   */
  private getExpiredCache(): StoreConfig | null {
    try {
      const cached = localStorage.getItem(StoreConfigService.CACHE_KEY);

      if (!cached) {
        return null;
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);

      if (cachedConfig.storeId !== this.storeId) {
        return null;
      }

      console.log('📦 [StoreConfigService] Cache expirado encontrado, usando como fallback');
      return cachedConfig.data;
    } catch (error) {
      console.error('❌ [StoreConfigService] Error leyendo cache expirado:', error);
      return null;
    }
  }

  /**
   * Guarda configuración en cache
   */
  private saveToCache(config: StoreConfig): void {
    try {
      const cachedConfig: CachedConfig = {
        data: config,
        timestamp: Date.now(),
        storeId: this.storeId
      };

      localStorage.setItem(StoreConfigService.CACHE_KEY, JSON.stringify(cachedConfig));
      console.log('💾 [StoreConfigService] Cache guardado (24h)');
    } catch (error) {
      console.error('❌ [StoreConfigService] Error guardando cache:', error);
    }
  }

  /**
   * Valida que la configuración requerida esté presente
   */
  private validateConfig(): void {
    if (!this.apiBaseUrl) {
      throw new Error('REACT_APP_CONFIG_API no está configurado');
    }

    if (!this.storeId) {
      throw new Error('REACT_APP_STORE_ID no está configurado');
    }
  }

  /**
   * Configuración mock para desarrollo
   */
  private getMockConfig(): StoreConfig {
    return {
      storeId: this.storeId || 'mock-store',
      branding: {
        primaryColor: '#FF3366',
        secondaryColor: '#3366FF',
        accentColor: '#33FF66',
        logoUrl: 'https://via.placeholder.com/200x80/FF3366/FFFFFF?text=MOCK+LOGO',
        fontFamily: 'Roboto, Arial, sans-serif',
        borderRadius: '12px'
      },
      currency: {
        code: 'COP',
        symbol: '$',
        decimalPlaces: 0
      },
      modules: {
        checkout: true,
        wishlist: true,
        reviews: true,
        loyalty: false,
        support: true
      },
      business: {
        name: 'Tienda Mock (Desarrollo)',
        contactEmail: 'desarrollo@tienda.com',
        phone: '+57 300 123 4567',
        address: 'Calle Mock 123, Desarrollo City'
      },
      configVersion: new Date().toISOString()
    };
  }

  /**
   * Configuración por defecto como último recurso
   */
  private getDefaultConfig(): StoreConfig {
    return {
      storeId: this.storeId || 'default-store',
      branding: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        accentColor: '#28a745',
        logoUrl: '',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px'
      },
      currency: {
        code: 'USD',
        symbol: '$',
        decimalPlaces: 2
      },
      modules: {
        checkout: true,
        wishlist: false,
        reviews: false
      },
      business: {
        name: 'Mi Tienda',
        contactEmail: 'contacto@tienda.com'
      },
      configVersion: '1970-01-01T00:00:00Z'
    };
  }

  /**
   * Limpia el cache manualmente
   */
  clearCache(): void {
    try {
      localStorage.removeItem(StoreConfigService.CACHE_KEY);
      console.log('🗑️ [StoreConfigService] Cache limpiado');
    } catch (error) {
      console.error('❌ [StoreConfigService] Error limpiando cache:', error);
    }
  }

  /**
   * Obtiene información del estado del cache
   */
  getCacheStatus(): {
    exists: boolean;
    isValid: boolean;
    isCorrectStore: boolean;
    expiresAt?: Date;
    ageInHours?: number;
  } {
    try {
      const cached = localStorage.getItem(StoreConfigService.CACHE_KEY);

      if (!cached) {
        return { exists: false, isValid: false, isCorrectStore: false };
      }

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const now = Date.now();
      const age = now - cachedConfig.timestamp;
      const isValid = age <= StoreConfigService.CACHE_DURATION_MS;
      const isCorrectStore = cachedConfig.storeId === this.storeId;
      const expiresAt = new Date(cachedConfig.timestamp + StoreConfigService.CACHE_DURATION_MS);
      const ageInHours = Math.round(age / (60 * 60 * 1000));

      return {
        exists: true,
        isValid,
        isCorrectStore,
        expiresAt,
        ageInHours
      };
    } catch (error) {
      console.error('❌ [StoreConfigService] Error obteniendo estado de cache:', error);
      return { exists: false, isValid: false, isCorrectStore: false };
    }
  }
}

// Instancia singleton del servicio
export const storeConfigService = new StoreConfigService();

// Exportar tipos para uso en componentes
export type { ApiResponse, CachedConfig, StoreConfig };

export default StoreConfigService;
