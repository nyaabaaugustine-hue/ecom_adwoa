import { User } from "../utils/auth";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Store
} from "lucide-react";

interface DashboardSidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  hasPermission: (permission: string) => boolean;
}

export function DashboardSidebar({ user, activeTab, onTabChange, onLogout, hasPermission }: DashboardSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, permission: 'view_orders' },
    { id: 'products', label: 'Products', icon: Package, permission: 'view_products' },
    { id: 'customers', label: 'Customers', icon: Users, permission: 'view_customers' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'view_analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'manage_settings' },
  ];

  const filteredMenu = menuItems.filter(item => hasPermission(item.permission));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-serif text-lg font-bold">A</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-medium text-gray-800">Adwoa's</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              user.role === 'admin' 
                ? 'bg-pink-100 text-pink-600' 
                : user.role === 'manager'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-pink-50 text-pink-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Store size={18} />
          View Store
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}