import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ShoppingBag, Package, DollarSign,
  Store, Clock, LayoutDashboard, ListOrdered,
  Tag, FolderOpen, BarChart3, Settings,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../layouts/DashboardLayout';
import StatsCard from '../../../components/dashboard/StatsCard';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import { AuthContext } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/formatPrice';
import api from '../../../services/api';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/admin',              icon: <LayoutDashboard size={18} /> },
  { label: 'Users',       href: '/admin/users',        icon: <Users size={18} /> },
  { label: 'Sellers',     href: '/admin/sellers',      icon: <Store size={18} /> },
  { label: 'Products',    href: '/admin/products',     icon: <ShoppingBag size={18} /> },
  { label: 'Orders',      href: '/admin/orders',       icon: <ListOrdered size={18} /> },
  { label: 'Categories',  href: '/admin/categories',   icon: <FolderOpen size={18} /> },
  { label: 'Coupons',     href: '/admin/coupons',      icon: <Tag size={18} /> },
  { label: 'Analytics',   href: '/admin/analytics',    icon: <BarChart3 size={18} /> },
  { label: 'Settings',    href: '/admin/settings',     icon: <Settings size={18} /> },
];

interface DashStats {
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
  topProducts: Array<{ _id: string; name: string; sold: number; price: number; images: string[]; seller: { storeName: string } }>;
  recentOrders: Array<{ _id: string; customer: { name: string; email: string }; total: number; status: string; createdAt: string }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number }>;
}

const AdminDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const user = (auth as any)?.user;

  const handleLogout = async () => {
    await auth?.logoutUser?.();
    window.location.href = '/login';
  };

  const o = stats?.overview;

  return (
    <DashboardLayout
      navItems={ADMIN_NAV}
      role="admin"
      userName={user?.name ?? 'Admin'}
      userAvatar={user?.profilePic}
      notificationCount={o?.pendingSellers ?? 0}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name ?? 'Admin'}! Here's what's happening.</p>
          </div>
          {(o?.pendingSellers ?? 0) > 0 && (
            <Link
              to="/admin/sellers?status=pending"
              className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <Clock size={15} />
              {o?.pendingSellers} pending seller{o?.pendingSellers !== 1 ? 's' : ''}
            </Link>
          )}
        </div>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue"     value={formatPrice(o?.totalRevenue ?? 0)}     icon={<DollarSign size={18} />} color="green"  change={o?.revenueGrowth} />
            <StatsCard title="This Month"        value={formatPrice(o?.thisMonthRevenue ?? 0)} icon={<BarChart3 size={18} />}  color="blue"   change={o?.revenueGrowth} />
            <StatsCard title="Total Orders"      value={o?.totalOrders ?? 0}                   icon={<Package size={18} />}    color="purple" />
            <StatsCard title="Monthly Orders"    value={o?.thisMonthOrders ?? 0}               icon={<ListOrdered size={18} />}color="teal"   />
            <StatsCard title="Customers"         value={o?.totalUsers ?? 0}                    icon={<Users size={18} />}      color="blue"   />
            <StatsCard title="Sellers"           value={o?.totalSellers ?? 0}                  icon={<Store size={18} />}      color="orange" />
            <StatsCard title="Products"          value={o?.totalProducts ?? 0}                 icon={<ShoppingBag size={18} />}color="purple" />
            <StatsCard title="Pending Sellers"   value={o?.pendingSellers ?? 0}                icon={<Clock size={18} />}      color="red"    />
          </div>
        )}

        {/* Orders by status */}
        {stats?.ordersByStatus && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <Link
                key={status}
                to={`/admin/orders?status=${status}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <StatusBadge status={status} size="sm" />
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {(stats?.recentOrders ?? []).slice(0, 6).map(order => (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={order.status} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))}
              {(stats?.recentOrders?.length ?? 0) === 0 && (
                <p className="text-center text-gray-400 py-6 text-sm">No orders yet.</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Top Products</h2>
              <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {(stats?.topProducts ?? []).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-bold text-gray-300 w-5 text-center">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.seller?.storeName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{product.sold} sold</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
              {(stats?.topProducts?.length ?? 0) === 0 && (
                <p className="text-center text-gray-400 py-6 text-sm">No products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
