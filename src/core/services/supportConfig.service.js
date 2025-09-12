// Servicio para obtener y persistir la configuración de soporte (WhatsApp, botón, etc)
class SupportConfigService {
  constructor() {
    this.key = 'supportConfig';
    this.defaultConfig = {
      whatsappNumber: '+573001234567',
      supportFloatingButton: true
    };
  }

  getConfig() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
      return this.defaultConfig;
    } catch {
      return this.defaultConfig;
    }
  }

  setConfig(config) {
    localStorage.setItem(this.key, JSON.stringify(config));
  }
}

export const supportConfigService = new SupportConfigService();
