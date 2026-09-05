import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
} from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../components/dashboard/DashboardLayout.optimized';
import DataTable, { Column } from '../../../components/dashboard/DataTable.optimized';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';
import api from '../../../services/api.optimized';
import SELLER_NAV from '../../../components/dashboard/sellerNav';
import { formatPrice } from '../../../utils/formatPrice';

// const SELLER_NAV: NavItem[] = [
//   { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
//   { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
//   { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
//   { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
//   { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
//   { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
// ];

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRow {
  id: string;
  customer?: { name?: string; email?: string };
  items: OrderItem[];
  status: string;
  total: number;
  sellerSubtotal?: number;
  createdAt: string;
  trackingNumber?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const STATUS_OPTIONS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

const PAGE_SIZE = 15;
const SEARCH_DEBOUNCE_MS = 350;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const apiError = error as ApiError;
  return apiError?.response?.data?.message ?? fallback;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchOrders = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }

      const { data } = await api.get(`/seller/orders?${params.toString()}`, { signal });

      setOrders(data?.data ?? []);

      const totalCount = Number(data?.pagination?.total ?? 0);
      setTotal(totalCount);
      setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Failed to load seller orders.'));
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, page, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchOrders(controller.signal);

    return () => controller.abort();
  }, [fetchOrders]);

  const showOrderDetails = useCallback((order: OrderRow) => {
    const items = order.items ?? [];

    const itemsHtml = items.length
      ? items
          .map(
            (item) =>
              `<div style="display:flex;justify-content:space-between;gap:16px;padding:4px 0">
                <span>${escapeHtml(item.name)} × ${Number(item.quantity) || 0}</span>
                <span>${formatPrice(Number(item.price) || 0)}</span>
              </div>`,
          )
          .join('')
      : '<p>No items found.</p>';

    void Swal.fire({
      title: 'Order details',
      html: `<div style="text-align:left;font-size:14px;color:#4b5563">${itemsHtml}</div>`,
      confirmButtonText: 'Close',
    });
  }, []);

  const handleStatusUpdate = useCallback(async (order: OrderRow) => {
    const { value: newStatus } = await Swal.fire({
      title: 'Update order status',
      input: 'select',
      inputOptions: Object.fromEntries(
        STATUS_OPTIONS.map((status) => [
          status,
          status.charAt(0).toUpperCase() + status.slice(1),
        ]),
      ),
      inputValue: order.status,
      showCancelButton: true,
      confirmButtonText: 'Update',
    });

    if (!newStatus || newStatus === order.status) return;

    let trackingNumber = order.trackingNumber ?? '';

    if (newStatus === 'shipped') {
      const result = await Swal.fire({
        title: 'Tracking number',
        input: 'text',
        inputValue: trackingNumber,
        inputPlaceholder: 'Optional tracking number',
        showCancelButton: true,
      });

      if (result.isDismissed) return;
      trackingNumber = result.value ?? '';
    }

    const previousOrder = order;

    setOrders((current) =>
      current.map((item) =>
        item.id === order.id
          ? { ...item, status: newStatus, trackingNumber }
          : item,
      ),
    );

    setUpdatingOrderId(order.id);

    try {
      await api.patch(`/seller/orders/${order.id}/status`, {
        status: newStatus,
        trackingNumber,
      });
    } catch (err: unknown) {
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? previousOrder : item)),
      );

      void Swal.fire(
        'Error',
        getErrorMessage(err, 'Failed to update order status.'),
        'error',
      );
    } finally {
      setUpdatingOrderId((current) =>
        current === order.id ? null : current,
      );
    }
  }, []);

  const columns = useMemo<Column<OrderRow>[]>(() => [
    {
      key: 'id',
      header: 'Order',
      render: (order) => (
        <div>
          <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-sm text-gray-700 inline-flex">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {order.customer?.name ?? 'Customer'}
          </p>
          <p className="text-xs text-gray-400">
            {order.customer?.email ?? '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (order) => (
        <span className="text-sm text-gray-600">
          {order.items?.length ?? 0} item(s)
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <StatusBadge status={order.status} size="sm" />,
    },
    {
      key: 'total',
      header: 'Subtotal',
      render: (order) => (
        <span className="font-semibold text-gray-900">
          {formatPrice(order.sellerSubtotal ?? order.total)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order) => {
        const isUpdating = updatingOrderId === order.id;

        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => void handleStatusUpdate(order)}
              disabled={isUpdating}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Update status"
            >
              <ChevronDown
                size={16}
                className={isUpdating ? 'animate-pulse' : ''}
              />
            </button>

            <button
              onClick={() => showOrderDetails(order)}
              className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
              title="View details"
            >
              <Eye size={16} />
            </button>
          </div>
        );
      },
    },
  ], [handleStatusUpdate, showOrderDetails, updatingOrderId]);

  return (
    <DashboardLayout
      navItems={SELLER_NAV}
      role="seller"
      userName="Seller"
      onLogout={() => {
        window.location.href = '/login';
      }}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 text-sm mt-1">
              {total.toLocaleString()} orders across your store.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-60 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
