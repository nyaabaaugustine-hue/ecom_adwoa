"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, AlertCircle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchOrders, fetchProducts, fetchCustomers, type Order, type Product, type Customer } from "../lib/store-api";
import { safeDate } from "../utils/date";

export function AdminOverview() {
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
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length;
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).slice(0, 4);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyRevenue = monthNames.map((name) => {
    const monthOrders = paidOrders.filter((o) => {
      const d = safeDate(o.createdAt);
      return d ? monthNames[d.getMonth()] === name : false;
    });
    return { name, sales: monthOrders.reduce((s, o) => s + o.total, 0) };
  });

  const catMap = new Map<string, number>();
  products.forEach((p) => { catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1); });
  const totalCats = products.length || 1;
  const catColors: Record<string, string> = {
    Fashion: "#ec4899", Cosmetics: "#f59e0b", Skincare: "#10b981",
    "Hair Care": "#6366f1", Accessories: "#8b5cf6",
  };
  const categorySales = Array.from(catMap.entries()).map(([name, count]) => ({
    name, value: Math.round((count / totalCats) * 100), color: catColors[name] ?? "#9ca3af",
  }));

  const recentOrdersList = orders.slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: `GHc ${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up' as const, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: orders.length.toLocaleString(), change: '+8.2%', trend: 'up' as const, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Customers', value: customers.length.toLocaleString(), change: '+15.3%', trend: 'up' as const, icon: Users, color: 'bg-purple-500' },
    { label: 'Products in Stock', value: inStock.toLocaleString(), change: '-2.4%', trend: 'down' as const, icon: Package, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} formatter={(value: number) => [`GHc${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {categorySales.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categorySales.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <span className="text-sm text-gray-400">{pendingOrders} pending</span>
          </div>
          <div className="space-y-4">
            {recentOrdersList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>
            ) : recentOrdersList.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={16} className="text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{order.customerName || "—"}</p>
                    <p className="text-xs text-gray-400 font-mono">{order.reference.slice(-8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">GHc{order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : order.status === 'processing' || order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">All products well-stocked ✓</p>
            ) : lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 px-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">{product.stock} left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}