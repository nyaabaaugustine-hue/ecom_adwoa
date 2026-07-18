"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, X, CheckCircle, Clock, Truck, XCircle, Package, Loader2 } from "lucide-react";
import { fetchOrders, updateOrderStatusApi, type Order } from "../lib/store-api";
import { formatDate, formatDateShort, formatTime } from "../utils/date";

interface OrdersManagerProps {
  hasPermission: (permission: string) => boolean;
}

export function OrdersManager({ hasPermission }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-gray-200 text-gray-700',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock size={14} />,
    processing: <Package size={14} />,
    shipped: <Truck size={14} />,
    delivered: <CheckCircle size={14} />,
    cancelled: <XCircle size={14} />,
    returned: <XCircle size={14} />,
  };

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatusApi(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      setSelectedOrder(updated);
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center justify-between mb-6">
          <span>{error}</span>
          <button onClick={() => setError("")}><X size={16} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">
            {hasPermission("manage_orders") ? "Orders Management" : "My Orders"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {hasPermission("manage_orders") ? "Manage and track all customer orders" : "Track your order history and delivery status"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
              className={`p-4 rounded-xl border transition-all ${
                statusFilter === status 
                  ? 'border-pink-300 bg-pink-50' 
                  : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${statusColors[status]}`}>
                {statusIcons[status]}
              </div>
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by reference or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Method</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date &amp; Time</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono font-medium text-gray-800">{order.reference}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{order.customerName || "—"}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">GHc{order.total.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.paymentStatus === "paid" ? "bg-green-100 text-green-600" :
                      order.paymentStatus === "failed" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.paymentMethod === "cod" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-600"
                    }`}>
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paystack"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {statusIcons[order.status]}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-600">{formatDateShort(order.createdAt)}</p>
                    <p className="text-xs text-gray-400">{formatTime(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-pink-500 hover:text-pink-600 p-1"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-4 md:inset-20 bg-white rounded-xl z-50 overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800 font-mono">{selectedOrder.reference}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <p className="text-gray-800 font-medium">{selectedOrder.customerName || "—"}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Placed</h3>
                  <p className="text-gray-800 font-medium">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-600" :
                      selectedOrder.paymentStatus === "failed" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedOrder.paymentMethod === "cod" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-600"
                    }`}>
                      {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Paystack"}
                    </span>
                  </div>
                  {selectedOrder.paymentMethod === "cod" && selectedOrder.paymentStatus !== "paid" && (
                    <p className="text-xs text-amber-600 mt-1">Collect cash on delivery — marking the order "delivered" will auto-record it as paid.</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">GHc{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">GHc{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">GHc{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {hasPermission('manage_orders') && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder, status)}
                        disabled={updatingId === selectedOrder.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all disabled:opacity-50 ${
                          selectedOrder.status === status
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
