import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { salesData, categorySales, regions, dashboardStats } from "../utils/dashboardData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

export function AnalyticsView() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Business insights and performance metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Revenue Growth</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              {dashboardStats.revenueGrowth}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">GHc{dashboardStats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Order Growth</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              {dashboardStats.ordersGrowth}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Avg Order Value</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight size={16} />
              5.2%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">GHc{(dashboardStats.totalRevenue / dashboardStats.totalOrders).toFixed(0)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Conversion Rate</span>
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <ArrowDownRight size={16} />
              2.1%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">3.2%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`GHc${value.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Sales by Category</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
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

      {/* Regional Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Regional Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => [`GHc${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#f472b6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}