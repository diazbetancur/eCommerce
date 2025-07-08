export const roles = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const permissions = {
  [roles.CUSTOMER]: ['view_products', 'create_orders', 'view_orders'],
  [roles.STAFF]: ['view_products', 'manage_orders', 'view_reports'],
  [roles.MANAGER]: ['manage_products', 'manage_staff', 'view_analytics'],
  [roles.ADMIN]: ['full_access']
};
