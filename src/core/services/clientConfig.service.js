// Servicio para obtener la configuración del cliente
// Permite cargar desde archivo local o desde una API

import { CLIENT_CONFIG as LOCAL_CONFIG } from '../config/client.config.js';

export class ClientConfigService {
  constructor() {
    this.config = null;
  }

  // Cargar config local
  loadLocalConfig() {
    console.log('📁 Loading local config...');
    try {
      this.config = LOCAL_CONFIG;
      console.log('✅ Local config loaded successfully:', this.config ? 'OK' : 'EMPTY');
      return this.config;
    } catch (error) {
      console.error('❌ Error loading local config:', error);
      throw error;
    }
  }

  // Cargar config desde API
  async loadConfigFromApi(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Error al obtener configuración');
      const data = await response.json();
      this.config = data;
      return this.config;
    } catch (error) {
      // Si falla, usa la config local como fallback
      console.warn('Failed to load config from API, using local config:', error.message);
      this.config = LOCAL_CONFIG;
      return this.config;
    }
  }

  // Obtener config actual
  getConfig() {
    return this.config || LOCAL_CONFIG;
  }
}
