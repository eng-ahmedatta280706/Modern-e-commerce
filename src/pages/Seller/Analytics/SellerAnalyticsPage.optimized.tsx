import React, { useEffect, useMemo, useState } from 'react';
import {
  ListOrdered,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout.optimized';
import StatsCard from '../../../components/dashboard/StatsCard.optimized';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';
import api from '../../../services/api.optimized';
import { formatPrice } from '../../../utils/formatPrice';
import SELLER_NAV from '../../../components/dashboard/sellerNav';

// const SELLER_NAV: NavItem[] = [
//   { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
//   { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
//   { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
//   { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
//   { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
//   { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
// ];

interface SellerOverview {
  thisMonthRevenue?: number;
  netRevenue?: number;
  totalOrders?: number;
  lowStockProducts?: number;
  revenueGrowth?: number;
}

interface MonthlySale {
  month: string;
  revenue: number;
  orders: number;
}

interface SellerAnalytics {
  overview?: SellerOverview;
  ordersByStatus?: Record<string, number>;
  monthlySales?: MonthlySale[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  const apiError = error as ApiError;
  return apiError?.response?.data?.message ?? fallback;
};

const SellerAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get('/seller/dashboard', {
          signal: controller.signal,
        });

        setStats(data?.data ?? null);
      } catch (err: unknown) {
        if ((err as { code?: string })?.code === 'ERR_CANCELED') return;

        setError(
          getErrorMessage(err, 'Failed to load seller analytics.'),
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  const orderStatuses = useMemo(
    () => Object.entries(stats?.ordersByStatus ?? {}),
    [stats?.ordersByStatus],
  );

  const monthlySales = useMemo(
    () => stats?.monthlySales ?? [],
    [stats?.monthlySales],
  );

  if (loading) {
    return (
      <DashboardLayout
        navItems={SELLER_NAV}
        role="seller"
        userName="Seller"
        onLogout={() => {
          window.location.href = '/login';
        }}
      >
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-sm animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={SELLER_NAV}
      role="seller"
      userName="Seller"
      onLogout={() => {
        window.location.href = '/login';
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sales and performance overview for your store.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Revenue"
            value={formatPrice(stats?.overview?.thisMonthRevenue ?? 0)}
            icon={<DollarSign size={18} />}
            color="green"
            change={stats?.overview?.revenueGrowth}
          />
          <StatsCard
            title="Net Revenue"
            value={formatPrice(stats?.overview?.netRevenue ?? 0)}
            icon={<TrendingUp size={18} />}
            color="teal"
          />
          <StatsCard
            title="Orders"
            value={stats?.overview?.totalOrders ?? 0}
            icon={<ListOrdered size={18} />}
            color="blue"
          />
          <StatsCard
            title="Low stock"
            value={stats?.overview?.lowStockProducts ?? 0}
            icon={<AlertTriangle size={18} />}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order status</h2>

            <div className="space-y-2">
              {orderStatuses.map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2"
                >
                  <StatusBadge status={status} size="sm" />
                  <span className="font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}

              {orderStatuses.length === 0 && (
                <p className="text-sm text-gray-400">
                  No order data yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h2 className="font-bold text-gray-900 mb-4">Monthly sales</h2>

            <div className="space-y-2">
              {monthlySales.map((month) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2"
                >
                  <span className="text-sm text-gray-600">
                    {month.month}
                  </span>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(month.revenue)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {month.orders} order{month.orders !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}

              {monthlySales.length === 0 && (
                <p className="text-sm text-gray-400">
                  No monthly data yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerAnalyticsPage;
