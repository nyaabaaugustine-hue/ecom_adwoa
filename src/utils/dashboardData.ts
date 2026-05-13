export const salesData = [
  { name: 'Jan', sales: 4200, orders: 240 },
  { name: 'Feb', sales: 3800, orders: 198 },
  { name: 'Mar', sales: 5100, orders: 320 },
  { name: 'Apr', sales: 4700, orders: 280 },
  { name: 'May', sales: 6300, orders: 390 },
  { name: 'Jun', sales: 5800, orders: 350 },
  { name: 'Jul', sales: 7200, orders: 450 },
  { name: 'Aug', sales: 6900, orders: 420 },
  { name: 'Sep', sales: 8400, orders: 520 },
  { name: 'Oct', sales: 7800, orders: 480 },
  { name: 'Nov', sales: 9500, orders: 580 },
  { name: 'Dec', sales: 12800, orders: 750 },
];

export const categorySales = [
  { name: 'Fashion', value: 35, color: '#ec4899' },
  { name: 'Skincare', value: 28, color: '#f59e0b' },
  { name: 'Hair Care', value: 22, color: '#10b981' },
  { name: 'Accessories', value: 15, color: '#6366f1' },
];

export const recentOrders = [
  { id: 'ORD-001', customer: 'Akua Mensah', total: 245, status: 'delivered', date: '2025-01-15' },
  { id: 'ORD-002', customer: 'Efua Asante', total: 180, status: 'pending', date: '2025-01-15' },
  { id: 'ORD-003', customer: 'Adwoa Osei', total: 320, status: 'processing', date: '2025-01-14' },
  { id: 'ORD-004', customer: 'Kofi Owusu', total: 95, status: 'shipped', date: '2025-01-14' },
  { id: 'ORD-005', customer: 'Ama Darko', total: 410, status: 'delivered', date: '2025-01-13' },
  { id: 'ORD-006', customer: 'Yaa Appiah', total: 165, status: 'pending', date: '2025-01-13' },
  { id: 'ORD-007', customer: 'Kwame Boateng', total: 285, status: 'cancelled', date: '2025-01-12' },
  { id: 'ORD-008', customer: 'Akosua Manu', total: 520, status: 'delivered', date: '2025-01-12' },
];

export const customers = [
  { id: 1, name: 'Akua Mensah', email: 'akua@email.com', orders: 12, spent: 2450, joined: '2023-06-15' },
  { id: 2, name: 'Efua Asante', email: 'efua@email.com', orders: 8, spent: 1800, joined: '2023-07-22' },
  { id: 3, name: 'Adwoa Osei', email: 'adwoa@email.com', orders: 15, spent: 3200, joined: '2023-05-10' },
  { id: 4, name: 'Kofi Owusu', email: 'kofi@email.com', orders: 5, spent: 950, joined: '2023-08-01' },
  { id: 5, name: 'Ama Darko', email: 'ama@email.com', orders: 20, spent: 4100, joined: '2023-04-18' },
];

// ✅ Missing export — required by DashboardHome & AnalyticsView
export const dashboardStats = {
  totalRevenue: 82800,
  revenueGrowth: 18.4,
  totalOrders: 4978,
  ordersGrowth: 12.7,
  totalCustomers: 10243,
  customersGrowth: 15.2,
  totalProducts: 50,
};

// ✅ Missing export — required by DashboardHome
export const topProducts = [
  { id: 1, name: 'Raw Shea Butter - 500g', sold: 892, revenue: 84740, stock: 142 },
  { id: 2, name: 'African Black Soap Bar', sold: 1245, revenue: 56025, stock: 318 },
  { id: 3, name: 'Ankara Maxi Dress', sold: 124, revenue: 43400, stock: 15 },
  { id: 4, name: 'Kente Eyeshadow Palette', sold: 456, revenue: 68400, stock: 87 },
  { id: 5, name: 'Shea Butter Hair Cream', sold: 567, revenue: 53865, stock: 204 },
];

// ✅ Missing export — required by AnalyticsView
export const regions = [
  { name: 'Greater Accra', revenue: 28400 },
  { name: 'Ashanti', revenue: 19200 },
  { name: 'Western', revenue: 8900 },
  { name: 'Central', revenue: 7100 },
  { name: 'Eastern', revenue: 6500 },
  { name: 'Northern', revenue: 5200 },
  { name: 'Volta', revenue: 4100 },
  { name: 'Brong-Ahafo', revenue: 3400 },
];
