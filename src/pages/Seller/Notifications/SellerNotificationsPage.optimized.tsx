import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCheck,
  Trash2,
  Search,
} from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../components/dashboard/DashboardLayout.optimized';
import SELLER_NAV from '../../../components/dashboard/sellerNav';
import api from '../../../services/api.optimized';

// const SELLER_NAV: NavItem[] = [
//   { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
//   { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
//   { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
//   { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
//   { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
//   { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
// ];

interface NotificationRow {
  id: string;
  title?: string;
  message?: string;
  text?: string;
  createdAt: string;
  isRead?: boolean;
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

const SellerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  const fetchNotifications = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get('/seller/notifications', { signal });
      setNotifications(data?.data ?? []);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Failed to load notifications.'));
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchNotifications(controller.signal);
    return () => controller.abort();
  }, [fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    const previous = notifications.find((item) => item.id === id);
    if (!previous || previous.isRead) return;

    // Optimistic update: update only this notification.
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
    setActionLoadingId(id);

    try {
      await api.patch(`/seller/notifications/${id}/read`);
    } catch (err: unknown) {
      setNotifications((current) =>
        current.map((item) => (item.id === id ? previous : item)),
      );

      void Swal.fire(
        'Error',
        getErrorMessage(err, 'Failed to mark notification as read.'),
        'error',
      );
    } finally {
      setActionLoadingId((current) => (current === id ? null : current));
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (!notification) return;

    const { isConfirmed } = await Swal.fire({
      title: 'Delete notification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });

    if (!isConfirmed) return;

    // Remove immediately and restore on failure.
    setNotifications((current) => current.filter((item) => item.id !== id));
    setActionLoadingId(id);

    try {
      await api.delete(`/seller/notifications/${id}`);
    } catch (err: unknown) {
      setNotifications((current) => {
        const exists = current.some((item) => item.id === id);
        if (exists) return current;

        return [...current, notification].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
      });

      void Swal.fire(
        'Error',
        getErrorMessage(err, 'Failed to delete notification.'),
        'error',
      );
    } finally {
      setActionLoadingId((current) => (current === id ? null : current));
    }
  }, [notifications]);

  const markAllRead = useCallback(async () => {
    const previous = notifications;
    if (!previous.some((item) => !item.isRead)) return;

    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
    setMarkAllLoading(true);

    try {
      await api.patch('/seller/notifications/all/read');
    } catch (err: unknown) {
      setNotifications(previous);

      void Swal.fire(
        'Error',
        getErrorMessage(err, 'Failed to mark all notifications as read.'),
        'error',
      );
    } finally {
      setMarkAllLoading(false);
    }
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notifications;

    return notifications.filter((item) =>
      [item.title, item.message, item.text].some((value) =>
        value?.toLowerCase().includes(q),
      ),
    );
  }, [notifications, search]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.isRead ? 0 : 1), 0),
    [notifications],
  );

  return (
    <DashboardLayout
      navItems={SELLER_NAV}
      role="seller"
      userName="Seller"
      notificationCount={unreadCount}
      onLogout={() => {
        window.location.href = '/login';
      }}
    >
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-sm mt-1">
              Keep track of order and store updates.
            </p>
          </div>

          <button
            onClick={() => void markAllRead()}
            disabled={markAllLoading || unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck size={16} />
            {markAllLoading ? 'Marking...' : 'Mark all as read'}
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-7 w-16 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-sm text-gray-400">
              {search.trim() ? 'No matching notifications found.' : 'No notifications found.'}
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const content =
                notification.title ??
                notification.message ??
                notification.text ??
                'Notification';

              const isActionLoading = actionLoadingId === notification.id;

              return (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start justify-between gap-4 ${
                    notification.isRead ? 'bg-white' : 'bg-brand-50/40'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => void markRead(notification.id)}
                        disabled={isActionLoading}
                        className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 disabled:opacity-50 transition-colors"
                        title="Mark read"
                      >
                        <CheckCheck
                          size={15}
                          className={isActionLoading ? 'animate-pulse' : ''}
                        />
                      </button>
                    )}

                    <button
                      onClick={() => void deleteNotification(notification.id)}
                      disabled={isActionLoading}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerNotificationsPage;
