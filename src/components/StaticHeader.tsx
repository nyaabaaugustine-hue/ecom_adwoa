"use client";

/**
 * StaticHeader — a thin client wrapper around Header that supplies
 * no-op handlers for pages that don't need cart/auth interactivity.
 * Use this in static/informational pages instead of importing Header directly.
 */
import { Header } from "./Header";

export function StaticHeader() {
  return (
    <Header
      cartCount={0}
      onCartClick={() => {}}
      onDashboardClick={() => {}}
      isAuthenticated={false}
      user={null}
      onLogout={() => {}}
    />
  );
}
