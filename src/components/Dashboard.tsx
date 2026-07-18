"use client";
import { useState } from "react";
import { User } from "../utils/auth";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHome } from "./DashboardHome";
import { OrdersManager } from "./OrdersManager";
import { ProductsManager } from "./ProductsManager";
import { CustomersManager } from "./CustomersManager";
import { AnalyticsView } from "./AnalyticsView";
import { SettingsView } from "./SettingsView";
import { Lock } from "lucide-react";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  hasPermission?: (permission: string) => boolean;
  loggingOut?: boolean;
}

const defaultPermissions: Record<string, string[]> = {
  admin: [
    "view_orders",
    "view_products",
    "view_customers",
    "view_analytics",
    "manage_settings",
    "manage_products",
    "manage_orders",
  ],
  manager: [
    "view_orders",
    "view_products",
    "view_customers",
    "view_analytics",
    "manage_products",
    "manage_orders",
  ],
  staff: ["view_orders", "view_products"],
  customer: ["view_orders"],
};

export function Dashboard({ user, onLogout, hasPermission, loggingOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const defaultHasPermission = (permission: string): boolean => {
    const perms = defaultPermissions[user.role] ?? [];
    return perms.includes(permission);
  };

  const checkPermission = hasPermission ?? defaultHasPermission;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome hasPermission={checkPermission} />;
      case "orders":
        return checkPermission("view_orders") ? (
          <OrdersManager hasPermission={checkPermission} />
        ) : (
          <AccessDenied />
        );
      case "products":
        return checkPermission("view_products") ? (
          <ProductsManager hasPermission={checkPermission} />
        ) : (
          <AccessDenied />
        );
      case "customers":
        return checkPermission("view_customers") ? (
          <CustomersManager />
        ) : (
          <AccessDenied />
        );
      case "analytics":
        return checkPermission("view_analytics") ? (
          <AnalyticsView />
        ) : (
          <AccessDenied />
        );
      case "settings":
        return checkPermission("manage_settings") ? (
          <SettingsView />
        ) : (
          <AccessDenied />
        );
      default:
        return <DashboardHome hasPermission={checkPermission} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        hasPermission={checkPermission}
        loggingOut={loggingOut}
      />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500 text-sm">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    </div>
  );
}
