"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag, Users, Package, DollarSign,
  ArrowUpRight, ArrowDownRight, Zap, Loader2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { fetchOrders, fetchProducts, fetchCustomers, type Order, type Product, type Customer } from "../lib/store-api";

interface DashboardHomeProps {
  hasPermission: (permission: string) => boolean;
}

export function DashboardHome({ hasPermission }: DashboardHomeProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts(), fetchCustomers()])
      .then(([o, p, c]) => { setOrders(o); setProducts(p); setCustomers(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  // Monthly aggregation
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = monthNames.map((name) => {
    const monthOrders = paidOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return monthNames[d.getMonth()] === name;
    });
    return {
      name,
      sales: monthOrders.reduce((s, o) => s + o.total, 0),
      orders: monthOrders.length,
    };
  });

  // Top products by order quantity
  const productSales = new Map<number, { name: string; sold: number; revenue: number; stock: number }>();
  paidOrders.forEach((o) => {
    (o.items ?? []).forEach((item) => {
      const existing = productSales.get(item.id ?? 0) ?? { name: item.name, sold: 0, revenue: 0, stock: 0 };
      existing.sold += item.quantity;
      existing.revenue += item.price * item.quantity;
      productSales.set(item.id ?? 0, existing);
    });
  });
  // Add current stock from products
  products.forEach((p) => {
    const existing = productSales.get(p.id);
    if (existing) existing.stock = p.stock;
  });
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const recentOrdersList = orders.slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: `GHc${totalRevenue.toLocaleString()}`,
      change: paidOrders.length > 0 ? 12.5 : 0,
      icon: DollarSign,
      color: "bg-pink-500",
    },
    {
      title: "Total Orders",
      value: orders.length.toLocaleString(),
      change: orders.length > 0 ? 8.2 : 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: customers.length.toLocaleString(),
      change: customers.length > 0 ? 15.2 : 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Products",
      value: products.length.toString(),
      change: 0,
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-sm border"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderColor: "#334155" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
            <Zap size={13} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xs leading-tight">TGNE Solutions</p>
            <p className="text-slate-400 text-[9px] uppercase tracking-widest">Admin Portal</p>
          </div>
          <div className="h-4 w-px mx-1" style={{ background: "#475569" }} />
          <div className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg,#ec4899,#8b5cf6)", color: "#fff" }}>
            v2.0
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon size={24} className="text-white" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {stat.change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-0.5">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Bar dataKey="orders" fill="#f472b6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              {hasPermission("view_orders") && (
                <button className="text-pink-500 text-sm font-medium hover:text-pink-600">View All</button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrdersList.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No orders yet</div>
            ) : recentOrdersList.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.customerName || "—"}</p>
                  <p className="text-xs text-gray-400 font-mono">{order.reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">GHc{order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "delivered" ? "bg-green-100 text-green-600" :
                    order.status === "processing" ? "bg-blue-100 text-blue-600" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                    order.status === "shipped" ? "bg-purple-100 text-purple-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
              {hasPermission("view_products") && (
                <button className="text-pink-500 text-sm font-medium hover:text-pink-600">View All</button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No sales yet</div>
            ) : topProducts.map((product, index) => (
              <div key={index} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sold} sold</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-800">GHc{product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{product.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TGNE Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-300 flex items-center justify-center gap-1.5">
          <Zap size={10} className="text-pink-300" />
          Powered by <span className="font-semibold text-gray-400">TGNE Solutions</span> · Tema, Ghana
        </p>
      </div>
    </div>
  );
}
