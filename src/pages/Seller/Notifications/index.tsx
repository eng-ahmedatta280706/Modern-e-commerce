import React, { useCallback, useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, ListOrdered, BarChart3, Bell, User2, CheckCheck, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import api from '../../../services/api';

const SELLER_NAV: NavItem[] = [
    { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
    { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
    { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
    { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
];

interface NotificationRow {
    id: string;
    title?: string;
    message?: string;
    text?: string;
    createdAt: string;
    isRead?: boolean;
}

const SellerNotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/seller/notifications');
            setNotifications(data.data ?? []);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message ?? 'Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markRead = async (id: string) => {
        await api.patch(`/seller/notifications/${id}/read`);
        await fetchNotifications();
    };

    const deleteNotification = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Delete notification?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#dc2626',
        });
        if (!isConfirmed) return;
        await api.delete(`/seller/notifications/${id}`);
        await fetchNotifications();
    };

    const markAllRead = async () => {
        await api.patch('/seller/notifications/all/read');
        await fetchNotifications();
    };

    const filtered = notifications.filter((item) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return [item.title, item.message, item.text]
            .some((value) => value?.toLowerCase().includes(q));
    });

    return (
        <DashboardLayout
            navItems={SELLER_NAV}
            role="seller"
            userName="Seller"
            onLogout={() => { window.location.href = '/login'; }}
        >
            <div className="space-y-5 max-w-4xl">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500 text-sm mt-1">Keep track of order and store updates.</p>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <CheckCheck size={16} />
                        Mark all as read
                    </button>
                </div>

                <div className="relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notifications..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-sm text-gray-400">Loading notifications...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-8 text-sm text-gray-400">No notifications found.</div>
                    ) : (
                        filtered.map((notification) => {
                            const content = notification.title ?? notification.message ?? notification.text ?? 'Notification';
                            return (
                                <div key={notification.id} className={`p-4 flex items-start justify-between gap-4 ${notification.isRead ? 'bg-white' : 'bg-brand-50/40'}`}>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">{content}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!notification.isRead && (
                                            <button onClick={() => markRead(notification.id)} className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors" title="Mark read">
                                                <CheckCheck size={15} />
                                            </button>
                                        )}
                                        <button onClick={() => deleteNotification(notification.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
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
