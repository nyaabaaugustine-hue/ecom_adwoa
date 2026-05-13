export interface User {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}

const users: (User & { password: string })[] = [
  {
    email: 'admin@adwoas.com',
    password: 'admin123',
    name: 'Adwoa Mensah',
    role: 'admin',
  },
  {
    email: 'manager@adwoas.com',
    password: 'manager123',
    name: 'Kofi Asante',
    role: 'manager',
  },
  {
    email: 'staff@adwoas.com',
    password: 'staff123',
    name: 'Ama Serwaa',
    role: 'staff',
  },
];

/** Used by LoginModal (page.tsx flow) */
export function authenticateUser(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const { password: _p, ...safeUser } = user;
  return safeUser;
}

/** Alias used by App.tsx (kept for compatibility) */
export function login(email: string, password: string): User | null {
  return authenticateUser(email, password);
}

const permissions: Record<User['role'], string[]> = {
  admin: ['view_dashboard', 'manage_products', 'manage_orders', 'manage_customers', 'manage_settings', 'view_analytics'],
  manager: ['view_dashboard', 'manage_products', 'manage_orders', 'view_analytics'],
  staff: ['view_dashboard', 'manage_orders'],
};

export function hasPermission(role: User['role'], permission: string): boolean {
  return permissions[role]?.includes(permission) ?? false;
}
