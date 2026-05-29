import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Package, DollarSign, AlertTriangle,
  LayoutDashboard, ListOrdered, Bell, User2, BarChart3,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import StatsCard from '../../../components/dashboard/StatsCard';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import { AuthContext } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/formatPrice';
import api from '../../../services/api';

const buildSellerNav = (unread: number): NavItem[] => [
  { label: 'Dashboard',     href: '/seller',                icon: <LayoutDashboard size={18} /> },
  { label: 'My Products',   href: '/seller/products',       icon: <ShoppingBag size={18} /> },
  { label: 'Orders',        href: '/seller/orders',         icon: <ListOrdered size={18} /> },
  { label: 'Analytics',     href: '/seller/analytics',      icon: <BarChart3 size={18} /> },
  { label: 'Notifications', href: '/seller/notifications',  icon: <Bell size={18} />, badge: unread },
  { label: 'Profile',       href: '/seller/profile',        icon: <User2 size={18} /> },
];

interface SellerStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    thisMonthOrders: number;
    thisMonthRevenue: number;
    netRevenue: number;
    commission: number;
    lastMonthRevenue: number;
    revenueGrowth: number;
    unreadNotifications: number;
  };
  ordersByStatus: Record<string, number>;
  topProducts: Array<{ _id: string; name: string; sold: number; price: number; images: string[]; stock: number }>;
  recentOrders: Array<{ _id: string; customer: { name: string }; sellerSubtotal?: number; total: number; status: string; createdAt: string }>;
  monthlySales: Array<{ month: string; revenue: number; orders: number }>;
}

const SellerDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/dashboard')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const user = (auth as any)?.user;
  const o    = stats?.overview;
  const unread = o?.unreadNotifications ?? 0;

  const handleLogout = async () => {
    await auth?.logoutUser?.();
    window.location.href = '/login';
  };

  return (
    <DashboardLayout
      navItems={buildSellerNav(unread)}
      role="seller"
      userName={user?.name ?? 'Seller'}
      userAvatar={user?.profilePic}
      storeName={user?.storeName}
      notificationCount={unread}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.storeName ?? 'My Store'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Your commission rate: <span className="font-semibold text-blue-600">{o?.commission ?? 0}%</span>
            </p>
          </div>
          {(o?.lowStockProducts ?? 0) > 0 && (
            <Link
              to="/seller/products?status=active&lowStock=true"
              className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <AlertTriangle size={15} />
              {o?.lowStockProducts} low stock item{o?.lowStockProducts !== 1 ? 's' : ''}
            </Link>
          )}
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Monthly Revenue"  value={formatPrice(o?.thisMonthRevenue ?? 0)} icon={<DollarSign size={18} />} color="green"  change={o?.revenueGrowth} />
            <StatsCard title="Net Earnings"     value={formatPrice(o?.netRevenue ?? 0)}       icon={<TrendingUp size={18} />} color="teal"   />
            <StatsCard title="Monthly Orders"   value={o?.thisMonthOrders ?? 0}               icon={<Package size={18} />}    color="blue"   />
            <StatsCard title="Total Orders"     value={o?.totalOrders ?? 0}                   icon={<ListOrdered size={18} />}color="purple" />
            <StatsCard title="Active Products"  value={o?.activeProducts ?? 0}                icon={<ShoppingBag size={18} />}color="blue"   />
            <StatsCard title="Total Products"   value={o?.totalProducts ?? 0}                 icon={<ShoppingBag size={18} />}color="purple" />
            <StatsCard title="Low Stock"        value={o?.lowStockProducts ?? 0}              icon={<AlertTriangle size={18} />} color="red" />
            <StatsCard title="Notifications"    value={unread}                                icon={<Bell size={18} />}       color="orange" />
          </div>
        )}

        {/* Orders by status */}
        {stats?.ordersByStatus && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <Link
                key={status}
                to={`/seller/orders?status=${status}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <div className="mt-1"><StatusBadge status={status} size="sm" /></div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/seller/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {(stats?.recentOrders ?? []).slice(0, 6).map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={order.status} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.sellerSubtotal ?? order.total)}
                    </span>
                  </div>
                </div>
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
              <Link to="/seller/products" className="text-sm text-blue-600 hover:underline">View all</Link>
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
                    <p className={`text-xs ${product.stock <= 5 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                      {product.stock} in stock
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{product.sold} sold</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
              {(stats?.topProducts?.length ?? 0) === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-3">No products yet.</p>
                  <Link to="/seller/products/new"
                    className="text-sm text-blue-600 font-medium hover:underline">
                    Add your first product →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
