import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Users, Store, ShoppingBag, ListOrdered, FolderOpen, Tag, BarChart3, Settings, DollarSign, Clock } from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout.optimized';
import StatsCard from '../../../components/dashboard/StatsCard.optimized';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';
import api from '../../../services/api.optimized';
import { formatPrice } from '../../../utils/formatPrice';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Sellers', href: '/admin/sellers', icon: <Store size={18} /> },
  { label: 'Products', href: '/admin/products', icon: <ShoppingBag size={18} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ListOrdered size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <FolderOpen size={18} /> },
  { label: 'Coupons', href: '/admin/coupons', icon: <Tag size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

interface DashboardData {
  overview: {
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingSellers: number;
    thisMonthOrders: number;
    thisMonthRevenue: number;
    revenueGrowth: number;
  };
  ordersByStatus: Record<string, number>;
  topProducts: Array<{ id: string; name: string; sold: number; price: number; images?: string[]; seller?: { storeName?: string } }>;
  recentOrders: Array<{ id: string; customer?: { name?: string; email?: string }; total: number; status: string; createdAt: string }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number }>;
}

const AdminAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message ?? 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const monthlySales = useMemo(() => stats?.monthlySales ?? [], [stats]);

  if (loading) {
    return (
      <DashboardLayout navItems={ADMIN_NAV} role="admin" userName="Admin" onLogout={() => { window.location.href = '/login'; }}>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-sm animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" userName="Admin" onLogout={() => { window.location.href = '/login'; }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">A deeper look at store performance and growth.</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Revenue" value={formatPrice(stats?.overview.totalRevenue ?? 0)} icon={<DollarSign size={18} />} color="green" change={stats?.overview.revenueGrowth} />
          <StatsCard title="Orders" value={stats?.overview.totalOrders ?? 0} icon={<ListOrdered size={18} />} color="blue" />
          <StatsCard title="Pending Sellers" value={stats?.overview.pendingSellers ?? 0} icon={<Clock size={18} />} color="orange" />
          <StatsCard title="Products" value={stats?.overview.totalProducts ?? 0} icon={<ShoppingBag size={18} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order breakdown</h2>
            <div className="space-y-2">
              {Object.entries(stats?.ordersByStatus ?? {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2">
                  <StatusBadge status={status} size="sm" />
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
              {(stats?.ordersByStatus ? Object.keys(stats.ordersByStatus).length : 0) === 0 && (
                <p className="text-sm text-gray-400">No order data available yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Monthly sales</h2>
            <div className="space-y-2">
              {monthlySales.map((entry) => (
                <div key={entry.month} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2">
                  <span className="text-sm text-gray-600">{entry.month}</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(entry.revenue)}</p>
                    <p className="text-xs text-gray-400">{entry.orders} order{entry.orders !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
              {monthlySales.length === 0 && <p className="text-sm text-gray-400">No sales history yet.</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Top products</h2>
            <div className="space-y-3">
              {(stats?.topProducts ?? []).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2">
                  <span className="text-sm font-bold text-gray-300 w-5 text-center">{index + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.seller?.storeName ?? 'Unknown seller'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{product.sold} sold</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
              {(stats?.topProducts?.length ?? 0) === 0 && <p className="text-sm text-gray-400">No products yet.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Recent orders</h2>
            <div className="space-y-3">
              {(stats?.recentOrders ?? []).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer?.name ?? 'Customer'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} size="sm" />
                    <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
              {(stats?.recentOrders?.length ?? 0) === 0 && <p className="text-sm text-gray-400">No recent orders.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
