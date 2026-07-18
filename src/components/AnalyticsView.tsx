"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { fetchOrders, fetchProducts, type Order, type Product } from "../lib/store-api";

export function AnalyticsView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()])
      .then(([o, p]) => { setOrders(o); setProducts(p); })
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
  const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const salesData = monthNames.map((name) => {
    const monthOrders = paidOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return monthNames[d.getMonth()] === name;
    });
    return { name, sales: monthOrders.reduce((s, o) => s + o.total, 0), orders: monthOrders.length };
  });

  const catMap = new Map<string, number>();
  products.forEach((p) => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));
  const totalCats = products.length || 1;
  const catColors: Record<string, string> = {
    Fashion: "#ec4899", Cosmetics: "#f59e0b", Skincare: "#10b981",
    "Hair Care": "#6366f1", Accessories: "#8b5cf6",
  };
  const categorySales = Array.from(catMap.entries()).map(([name, count]) => ({
    name, value: Math.round((count / totalCats) * 100),
    color: catColors[name] ?? "#9ca3af",
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Business insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              {paidOrders.length > 0 ? "100%" : "0%"}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">GHc{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Orders</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              {orders.length > 0 ? "100%" : "0%"}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{orders.length.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Avg Order Value</span>
            <div className="flex items-center gap-1 text-green-500 text-sm"><ArrowUpRight size={16} />—</div>
          </div>
          <p className="text-2xl font-bold text-gray-800">GHc{avgOrderValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Paid Orders</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              {orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) + "%" : "0%"}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{paidOrders.length.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} formatter={(value: number) => [`GHc${value.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Products by Category</h3>
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

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Revenue</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }} formatter={(value: number) => [`GHc${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="sales" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}