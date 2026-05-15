"use client";

import { User } from "../utils/auth";
import { SafeImage } from "./SafeImage";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Store,
  Zap
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
      {/* Store Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-serif text-lg font-bold">A</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-gray-800 leading-tight">Adwoa's</h1>
            <p className="text-[9px] text-pink-400 uppercase tracking-[0.18em] font-semibold">Beauty &amp; Fashion</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <SafeImage
            src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} className={activeTab === item.id ? 'text-pink-500' : ''} />
                  {item.label}
                  {activeTab === item.id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />
                  )}
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Store size={18} />
          View Store
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* ── TGNE Solutions Branding ── */}
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden">
        <div
          className="p-3 flex items-center gap-2.5"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          {/* TGNE Logo mark */}
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg"
            style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
          >
            <Zap size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs leading-tight tracking-wide">TGNE Solutions</p>
            <p className="text-slate-400 text-[9px] tracking-widest uppercase font-medium">
              Powered by TGNE
            </p>
          </div>
        </div>
        <div
          className="h-0.5"
          style={{
            background: "linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)",
          }}
        />
      </div>
    </aside>
  );
}
