"use client";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Tags, Truck, CreditCard, Bell, Shield, FileText, Percent,
  ChevronLeft, LogOut, Menu, AlertCircle, Loader2,
} from "lucide-react";
import { User } from "../utils/auth";
import { AdminOverview } from "./AdminOverview";
import { AdminProducts } from "./AdminProducts";
import { OrdersManager } from "./OrdersManager";
import { CustomersManager } from "./CustomersManager";
import { AnalyticsView } from "./AnalyticsView";
import { ReportsView } from "./ReportsView";
import { DiscountsView } from "./DiscountsView";
import { ShippingView } from "./ShippingView";
import { PaymentsView } from "./PaymentsView";
import { NotificationsView } from "./NotificationsView";
import { SecurityView } from "./SecurityView";

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

type AdminView =
  | "overview" | "products" | "orders" | "customers" | "analytics"
  | "discounts" | "shipping" | "payments" | "notifications" | "security" | "reports";

const menuItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case "overview": return <AdminOverview />;
      case "products": return <AdminProducts />;
      case "orders": return <OrdersManager hasPermission={() => true} />;
      case "customers": return <CustomersManager />;
      case "analytics": return <AnalyticsView />;
      case "reports": return <ReportsView />;
      case "discounts": return <DiscountsView />;
      case "shipping": return <ShippingView />;
      case "payments": return <PaymentsView />;
      case "notifications": return <NotificationsView />;
      case "security": return <SecurityView />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 flex flex-col flex-shrink-0 relative`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1784297096/adjologo_jhcfap.png" alt="Adwoa's Beauty" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain flex-shrink-0" />
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="font-bold text-base leading-tight truncate">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-400 truncate">Adwoa&apos;s Beauty</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-16 w-6 h-6 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10 shadow-md"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                currentView === item.id
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon size={19} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => { setLoggingOut(true); onLogout(); }}
            disabled={loggingOut}
            className={`w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            } disabled:opacity-50`}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            {loggingOut ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />}
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800 capitalize">
                  {currentView}
                </h1>
                <p className="text-xs text-gray-400">
                  Manage your {currentView}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <AlertCircle size={20} className="text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
