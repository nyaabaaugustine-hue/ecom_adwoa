"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { fetchOrders, fetchProducts, type Order, type Product } from "../lib/store-api";

export function ReportsView() {
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
    return <div className="flex items-center justify-center py-24 text-gray-400"><Loader2 size={28} className="animate-spin" /></div>;
  }

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;

  const reports = [
    { title: "Sales Report", desc: "Monthly revenue, order volume, and payment breakdown.", rows: ["Total Revenue: GHc" + totalRevenue.toLocaleString(), "Paid Orders: " + paidOrders.length, "Pending Payments: " + orders.filter(o => o.paymentStatus !== "paid").length], color: "bg-green-500" },
    { title: "Inventory Report", desc: "Stock levels, low stock alerts, and product performance.", rows: ["Total Products: " + products.length, "In Stock: " + inStock, "Out of Stock: " + outOfStock], color: "bg-blue-500" },
    { title: "Customer Report", desc: "Customer acquisition, repeat purchases, and engagement.", rows: ["New Customers: —", "Repeat Rate: —", "Top Customers: —"], color: "bg-purple-500" },
      { title: "Category Performance", desc: "Sales by product category and subcategory.", rows: ["Fashion: GHc" + paidOrders.reduce((s, o) => s + o.total, 0).toLocaleString(), "Total Categories: " + new Set(products.map(p => p.category)).size, "Total Products: " + products.length], color: "bg-amber-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-gray-800">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and download business reports.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <div key={r.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${r.color} rounded-lg flex items-center justify-center`}>
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.title}</h3>
                    <p className="text-xs text-gray-400">{r.desc}</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {r.rows.map((row, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    {row}
                  </li>
                ))}
              </ul>
              <button className="flex items-center gap-2 text-pink-500 font-medium text-sm hover:text-pink-600">
                <Download size={14} /> Download Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
