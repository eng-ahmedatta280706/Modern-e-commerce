import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ListOrdered, Search, Eye, LayoutDashboard,
  Users, Store, ShoppingBag, Tag, FolderOpen,
  BarChart3, Settings, ChevronDown,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import api from '../../../services/api';
import { formatPrice } from '../../../utils/formatPrice';
import Swal from 'sweetalert2';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/admin',            icon: <LayoutDashboard size={18} /> },
  { label: 'Users',      href: '/admin/users',      icon: <Users size={18} /> },
  { label: 'Sellers',    href: '/admin/sellers',    icon: <Store size={18} /> },
  { label: 'Products',   href: '/admin/products',   icon: <ShoppingBag size={18} /> },
  { label: 'Orders',     href: '/admin/orders',     icon: <ListOrdered size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <FolderOpen size={18} /> },
  { label: 'Coupons',    href: '/admin/coupons',    icon: <Tag size={18} /> },
  { label: 'Analytics',  href: '/admin/analytics',  icon: <BarChart3 size={18} /> },
  { label: 'Settings',   href: '/admin/settings',   icon: <Settings size={18} /> },
];

interface Order {
  _id: string;
  customer: { name: string; email: string };
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const STATUS_TABS = ['all', ...STATUS_OPTIONS] as const;

const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const activeStatus = searchParams.get('status') ?? 'all';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (activeStatus !== 'all') params.set('status', activeStatus);
      if (search) params.set('search', search);

      const { data } = await api.get(`/admin/orders?${params}`);
      setOrders(data.data);
      setTotal(data.pagination.total);
      setTotalPages(Math.ceil(data.pagination.total / 15));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (order: Order) => {
    const { value: newStatus } = await Swal.fire({
      title: `Update Order Status`,
      html: `<p class="text-sm text-gray-500 mb-2">Order #${order._id.slice(-8).toUpperCase()}</p>`,
      input: 'select',
      inputOptions: Object.fromEntries(STATUS_OPTIONS.map(s => [s, s.charAt(0).toUpperCase() + s.slice(1)])),
      inputValue: order.status,
      showCancelButton: true,
      confirmButtonText: 'Update',
    });
    if (!newStatus || newStatus === order.status) return;

    let trackingNumber = '';
    if (newStatus === 'shipped') {
      const { value: tn } = await Swal.fire({
        title: 'Add Tracking Number (optional)',
        input: 'text',
        inputPlaceholder: 'e.g. TRK123456789',
        showCancelButton: true,
      });
      trackingNumber = tn ?? '';
    }

    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus, trackingNumber });
      Swal.fire('Updated!', `Order status changed to ${newStatus}.`, 'success');
      fetchOrders();
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message ?? 'Could not update status.', 'error');
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
          #{o._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (o) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{o.customer?.name}</p>
          <p className="text-xs text-gray-400">{o.customer?.email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o) => (
        <span className="text-sm text-gray-600">
          {o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (o) => <span className="font-semibold text-gray-900">{formatPrice(o.total)}</span>,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o) => <StatusBadge status={o.paymentStatus} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (o) => (
        <span className="text-xs text-gray-500">
          {new Date(o.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (o) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/orders/${o._id}`}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="View order"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => handleStatusUpdate(o)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Update status"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      navItems={ADMIN_NAV}
      role="admin"
      userName="Admin"
      onLogout={() => { window.location.href = '/login'; }}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} total orders</p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setSearchParams(tab === 'all' ? {} : { status: tab }); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeStatus === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer or order ID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          keyExtractor={o => o._id}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No orders found."
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminOrdersPage;
