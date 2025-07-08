export const businessConfigs = {
  restaurant: {
    name: 'Restaurante',
    features: {
      customizations: true,
      tableService: true,
      delivery: true,
      reservations: true,
      specialInstructions: true
    },
    modules: ['products', 'cart', 'orders', 'restaurant', 'payments'],
    navigation: ['menu', 'cart', 'orders', 'profile'],
    theme: 'restaurant-theme'
  },
  retail: {
    name: 'Tienda',
    features: {
      inventory: true,
      variants: true,
      shipping: true,
      returns: true
    },
    modules: ['products', 'cart', 'orders', 'inventory', 'payments'],
    navigation: ['catalog', 'cart', 'orders', 'profile'],
    theme: 'retail-theme'
  },
  services: {
    name: 'Servicios',
    features: {
      appointments: true,
      calendar: true,
      staff: true
    },
    modules: ['services', 'appointments', 'calendar', 'payments'],
    navigation: ['services', 'appointments', 'profile'],
    theme: 'services-theme'
  }
};
