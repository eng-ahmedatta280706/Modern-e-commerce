import React, { useEffect, useState } from 'react';
import {
  Store,
  Mail,
  BadgeInfo,
} from 'lucide-react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout.optimized';
import api from '../../../services/api.optimized';
import SELLER_NAV from '../../../components/dashboard/sellerNav';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';

// const SELLER_NAV: NavItem[] = [
//   { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
//   { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
//   { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
//   { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
//   { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
//   { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
// ];

interface SellerProfile {
  name?: string;
  email?: string;
  profilePic?: string;
  storeName?: string;
  commissionRate?: number;
  sellerStatus?: string;
  role?: string;
  storeBio?: string;
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

const SellerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get('/seller/profile', {
          signal: controller.signal,
        });

        setProfile(data?.data ?? null);
      } catch (err: unknown) {
        if ((err as { code?: string })?.code === 'ERR_CANCELED') return;

        setError(getErrorMessage(err, 'Failed to load profile.'));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  const sellerName = profile?.name ?? 'Seller';
  const sellerEmail = profile?.email ?? 'No email available';

  return (
    <DashboardLayout
      navItems={SELLER_NAV}
      role="seller"
      userName={sellerName}
      userAvatar={profile?.profilePic}
      storeName={profile?.storeName}
      onLogout={() => {
        window.location.href = '/login';
      }}
    >
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your store and account details.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <div className="h-6 w-40 bg-gray-100 rounded-sm animate-pulse" />
            <div className="mt-4 space-y-3">
              <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 overflow-hidden flex items-center justify-center text-brand-600 font-bold text-xl">
                  {profile?.profilePic ? (
                    <img
                      src={profile.profilePic}
                      alt={sellerName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    sellerName[0] ?? 'S'
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {sellerName}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {sellerEmail}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Store
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.storeName ?? '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Commission
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.commissionRate ?? 0}%
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge
                      status={profile?.sellerStatus ?? 'pending'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Role
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.role ?? 'seller'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
              <h2 className="font-bold text-gray-900">Store details</h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Store size={16} className="mt-0.5 text-brand-500 shrink-0" />
                  <span>
                    {profile?.storeBio ?? 'No store bio has been added yet.'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-brand-500 shrink-0" />
                  <span>{profile?.email ?? 'No email available'}</span>
                </div>

                <div className="flex items-start gap-3">
                  <BadgeInfo
                    size={16}
                    className="mt-0.5 text-brand-500 shrink-0"
                  />
                  <span>
                    Profile updates are currently read-only from the dashboard
                    and come from your account settings.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerProfilePage;
