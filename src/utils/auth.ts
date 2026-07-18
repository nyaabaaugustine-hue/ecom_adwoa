export interface User {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  avatar?: string;
}

const permissions: Record<User['role'], string[]> = {
  admin: ['view_dashboard', 'manage_products', 'manage_orders', 'manage_customers', 'manage_settings', 'view_analytics', 'view_reports', 'manage_users'],
  manager: ['view_dashboard', 'manage_products', 'manage_orders', 'view_analytics', 'view_reports'],
  staff: ['view_dashboard', 'manage_orders'],
  customer: ['view_dashboard', 'view_orders'],
};

export function hasPermission(role: User['role'], permission: string): boolean {
  return permissions[role]?.includes(permission) ?? false;
}

export function login(): null {
  return null;
}
