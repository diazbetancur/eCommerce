// config/modules.config.js
export const BUSINESS_TYPES = {
  RESTAURANT: 'restaurant',
  RETAIL: 'retail',
  SERVICES: 'services'
};

export const MODULE_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

// Módulos que SIEMPRE se entregan (gratuitos)
export const CORE_MODULES = {
  products: {
    id: 'products',
    name: 'Catálogo de Productos',
    description: 'Ver productos y categorías',
    tier: MODULE_TIERS.FREE,
    features: {
      view_catalog: true,
      view_categories: true,
      basic_search: true,
      product_details: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL, BUSINESS_TYPES.SERVICES]
  },

  cart: {
    id: 'cart',
    name: 'Carrito Básico',
    description: 'Agregar productos y checkout básico',
    tier: MODULE_TIERS.FREE,
    features: {
      add_to_cart: true,
      view_cart: true,
      basic_checkout: true,
      persist_cart: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL]
  },

  user_profile: {
    id: 'user_profile',
    name: 'Perfil de Usuario',
    description: 'Gestión básica de perfil',
    tier: MODULE_TIERS.FREE,
    features: {
      view_profile: true,
      edit_basic_info: true,
      view_order_history: true,
      change_password: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL, BUSINESS_TYPES.SERVICES]
  },

  promotions: {
    id: 'promotions',
    name: 'Promociones Básicas',
    description: 'Ver ofertas y descuentos',
    tier: MODULE_TIERS.FREE,
    features: {
      view_promotions: true,
      basic_discounts: true,
      promotional_banners: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL, BUSINESS_TYPES.SERVICES]
  }
};

// Módulos premium/de pago
export const PREMIUM_MODULES = {
  restaurant_customization: {
    id: 'restaurant_customization',
    name: 'Personalización de Productos',
    description: 'Modificadores, ingredientes extra, instrucciones especiales',
    tier: MODULE_TIERS.BASIC,
    price: 19.99,
    features: {
      product_modifiers: true,
      special_instructions: true,
      ingredient_customization: true,
      price_calculation: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT]
  },

  loyalty_program: {
    id: 'loyalty_program',
    name: 'Programa de Lealtad',
    description: 'Puntos, recompensas y descuentos por fidelidad',
    tier: MODULE_TIERS.PRO,
    price: 29.99,
    features: {
      point_accumulation: true,
      reward_redemption: true,
      tier_system: true,
      exclusive_offers: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL]
  },

  advanced_analytics: {
    id: 'advanced_analytics',
    name: 'Analytics Avanzado',
    description: 'Reportes detallados y métricas de negocio',
    tier: MODULE_TIERS.PRO,
    price: 39.99,
    features: {
      sales_reports: true,
      customer_analytics: true,
      product_performance: true,
      custom_dashboards: true
    },
    availableFor: [BUSINESS_TYPES.RESTAURANT, BUSINESS_TYPES.RETAIL, BUSINESS_TYPES.SERVICES]
  }
};

// Configuración por tipo de negocio
export const BUSINESS_CONFIGS = {
  [BUSINESS_TYPES.RESTAURANT]: {
    name: 'Restaurante',
    defaultModules: ['products', 'cart', 'user_profile', 'promotions'],
    recommendedModules: ['restaurant_customization', 'loyalty_program'],
    theme: {
      primaryColor: '#FF6B35',
      secondaryColor: '#F7931E',
      accentColor: '#FFE66D'
    }
  },

  [BUSINESS_TYPES.RETAIL]: {
    name: 'Tienda',
    defaultModules: ['products', 'cart', 'user_profile', 'promotions'],
    recommendedModules: ['inventory_management', 'loyalty_program'],
    theme: {
      primaryColor: '#2196F3',
      secondaryColor: '#1976D2',
      accentColor: '#03DAC6'
    }
  }
};

// Utilidades para trabajar con módulos
export const ModuleUtils = {
  // Obtener módulos activos para un tipo de negocio
  getActiveModules: (businessType, userLicense = {}) => {
    const config = BUSINESS_CONFIGS[businessType];
    if (!config) return [];

    return config.defaultModules.filter((moduleId) => {
      const module = CORE_MODULES[moduleId] || PREMIUM_MODULES[moduleId];
      return module && (module.tier === MODULE_TIERS.FREE || userLicense[moduleId]);
    });
  },

  // Verificar si un módulo está disponible
  isModuleAvailable: (moduleId, businessType, userLicense = {}) => {
    const module = CORE_MODULES[moduleId] || PREMIUM_MODULES[moduleId];
    if (!module) return false;

    const isForBusinessType = module.availableFor.includes(businessType);
    const hasLicense = module.tier === MODULE_TIERS.FREE || userLicense[moduleId];

    return isForBusinessType && hasLicense;
  },

  // Verificar si una feature específica está disponible
  hasFeature: (moduleId, featureName, businessType, userLicense = {}) => {
    if (!ModuleUtils.isModuleAvailable(moduleId, businessType, userLicense)) {
      return false;
    }

    const module = CORE_MODULES[moduleId] || PREMIUM_MODULES[moduleId];
    return module.features[featureName] || false;
  }
};
