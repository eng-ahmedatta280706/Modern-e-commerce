import React, { useCallback, useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingBag, ListOrdered, BarChart3, Bell, User2, Search, ChevronDown, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import api from '../../../services/api';
import { formatPrice } from '../../../utils/formatPrice';

const SELLER_NAV: NavItem[] = [
    { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
    { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
    { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
    { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
];

interface OrderRow {
    id: string;
    customer?: { name?: string; email?: string };
    items: Array<{ name: string; quantity: number; price: number }>;
    status: string;
    total: number;
    sellerSubtotal?: number;
    createdAt: string;
    trackingNumber?: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const SellerOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15' });
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search.trim()) params.set('search', search.trim());
            const { data } = await api.get(`/seller/orders?${params}`);
            setOrders(data.data ?? []);
            setTotal(data.pagination?.total ?? 0);
            setTotalPages(Math.max(1, Math.ceil((data.pagination?.total ?? 0) / 15)));
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message ?? 'Failed to load seller orders.');
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (order: OrderRow) => {
        const { value: newStatus } = await Swal.fire({
            title: 'Update order status',
            input: 'select',
            inputOptions: Object.fromEntries(STATUS_OPTIONS.map((status) => [status, status.charAt(0).toUpperCase() + status.slice(1)])),
            inputValue: order.status,
            showCancelButton: true,
            confirmButtonText: 'Update',
        });

        if (!newStatus || newStatus === order.status) return;

        let trackingNumber = '';
        if (newStatus === 'shipped') {
            const result = await Swal.fire({
                title: 'Tracking number',
                input: 'text',
                inputPlaceholder: 'Optional tracking number',
                showCancelButton: true,
            });
            trackingNumber = result.value ?? '';
        }

        try {
            await api.patch(`/seller/orders/${order.id}/status`, { status: newStatus, trackingNumber });
            await fetchOrders();
        } catch (err: any) {
            Swal.fire('Error', err?.response?.data?.message ?? 'Failed to update order status.', 'error');
        }
    };

    const columns: Column<OrderRow>[] = [
        {
            key: 'id',
            header: 'Order',
            render: (order) => (
                <div>
                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-sm text-gray-700 inline-flex">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            ),
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (order) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer?.name ?? 'Customer'}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email ?? '—'}</p>
                </div>
            ),
        },
        {
            key: 'items',
            header: 'Items',
            render: (order) => <span className="text-sm text-gray-600">{order.items?.length ?? 0} item(s)</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (order) => <StatusBadge status={order.status} size="sm" />,
        },
        {
            key: 'total',
            header: 'Subtotal',
            render: (order) => <span className="font-semibold text-gray-900">{formatPrice(order.sellerSubtotal ?? order.total)}</span>,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (order) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleStatusUpdate(order)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Update status"
                    >
                        <ChevronDown size={16} />
                    </button>
                    <button
                        onClick={() => Swal.fire({ title: 'Order details', html: `<p class="text-sm text-gray-500">${order.items.map((item) => `${item.name} × ${item.quantity}`).join('<br/>')}</p>`, confirmButtonText: 'Close' })}
                        className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View details"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout
            navItems={SELLER_NAV}
            role="seller"
            userName="Seller"
            onLogout={() => { window.location.href = '/login'; }}
        >
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} orders across your store.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search orders..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-60 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="all">All statuses</option>
                        {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={orders}
                    loading={loading}
                    keyExtractor={(order) => order.id}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    emptyMessage="No seller orders found."
                />
            </div>
        </DashboardLayout>
    );
};

export default SellerOrdersPage;
