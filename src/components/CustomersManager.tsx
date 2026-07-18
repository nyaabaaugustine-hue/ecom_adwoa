"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, MapPin, ShoppingBag, Loader2 } from "lucide-react";
import { fetchCustomers, fetchOrders, type Customer, type Order } from "../lib/store-api";
import { formatDateShort } from "../utils/date";

interface CustomerWithStats extends Customer {
  orderCount: number;
  totalSpent: number;
}

export function CustomersManager() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithStats | null>(null);

  useEffect(() => {
    Promise.all([fetchCustomers(), fetchOrders()])
      .then(([customerRows, orderRows]) => {
        const byEmail = new Map<string, Order[]>();
        for (const order of orderRows) {
          const list = byEmail.get(order.customerEmail) ?? [];
          list.push(order);
          byEmail.set(order.customerEmail, list);
        }
        const withStats: CustomerWithStats[] = customerRows.map((c) => {
          const custOrders = byEmail.get(c.email) ?? [];
          const paidOrders = custOrders.filter((o) => o.paymentStatus === "paid");
          return {
            ...c,
            orderCount: custOrders.length,
            totalSpent: paidOrders.reduce((sum, o) => sum + o.total, 0),
          };
        });
        setCustomers(withStats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage customer accounts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
          <p className="text-sm text-gray-500">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-3xl font-bold text-pink-500">{customers.filter(c => c.orderCount > 1).length}</p>
          <p className="text-sm text-gray-500">Repeat Customers</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-3xl font-bold text-green-600">GHc{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Address</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-500 font-medium">{customer.name.charAt(0).toUpperCase() || "?"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{customer.name || "—"}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-600 truncate max-w-xs">{customer.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-800">
                      <ShoppingBag size={14} className="text-pink-400" />
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">GHc{customer.totalSpent.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{formatDateShort(customer.createdAt)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No customers yet</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedCustomer(null)} />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-xl z-50 overflow-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-500 font-bold text-xl">{selectedCustomer.name.charAt(0).toUpperCase() || "?"}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{selectedCustomer.name || "—"}</h3>
                  <p className="text-sm text-gray-400">Customer since {formatDateShort(selectedCustomer.createdAt)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCustomer.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedCustomer.address || "—"}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{selectedCustomer.orderCount}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-2xl font-bold text-pink-500">GHc{selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
