import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { dashboardStats, recentOrders, salesData, topProducts } from "../utils/dashboardData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DashboardHomeProps {
  hasPermission: (permission: string) => boolean;
}

export function DashboardHome({ hasPermission }: DashboardHomeProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `GHc${dashboardStats.totalRevenue.toLocaleString()}`,
      change: dashboardStats.revenueGrowth,
      icon: DollarSign,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: dashboardStats.ordersGrowth,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Customers',
      value: dashboardStats.totalCustomers.toLocaleString(),
      change: 15.2,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Products',
      value: dashboardStats.totalProducts.toString(),
      change: 0,
      icon: Package,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  dot={{ fill: '#ec4899', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Orders Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
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
              <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
              {hasPermission('view_orders') && (
                <button className="text-pink-500 text-sm font-medium hover:text-pink-600">
                  View All
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">GHc{order.total}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
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
              <h3 className="text-lg font-medium text-gray-800">Top Products</h3>
              {hasPermission('view_products') && (
                <button className="text-pink-500 text-sm font-medium hover:text-pink-600">
                  View All
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topProducts.map((product, index) => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sold} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">GHc{product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{product.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}