import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Store, CheckCircle, XCircle, Ban,
  Search, ExternalLink, LayoutDashboard,
  Users, ShoppingBag, ListOrdered, Tag, FolderOpen, BarChart3, Settings,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../layouts/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/admin',             icon: <LayoutDashboard size={18} /> },
  { label: 'Users',      href: '/admin/users',       icon: <Users size={18} /> },
  { label: 'Sellers',    href: '/admin/sellers',     icon: <Store size={18} /> },
  { label: 'Products',   href: '/admin/products',    icon: <ShoppingBag size={18} /> },
  { label: 'Orders',     href: '/admin/orders',      icon: <ListOrdered size={18} /> },
  { label: 'Categories', href: '/admin/categories',  icon: <FolderOpen size={18} /> },
  { label: 'Coupons',    href: '/admin/coupons',     icon: <Tag size={18} /> },
  { label: 'Analytics',  href: '/admin/analytics',   icon: <BarChart3 size={18} /> },
  { label: 'Settings',   href: '/admin/settings',    icon: <Settings size={18} /> },
];

interface Seller {
  _id: string;
  name: string;
  email: string;
  storeName: string;
  sellerStatus: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  profilePic?: string;
}

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected', 'suspended'] as const;

const AdminSellersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sellers, setSellers]     = useState<Seller[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const activeStatus = searchParams.get('status') ?? 'all';

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (activeStatus !== 'all') params.set('status', activeStatus);
      if (search) params.set('search', search);

      const { data } = await api.get(`/admin/sellers?${params}`);
      setSellers(data.data);
      setTotalPages(Math.ceil(data.pagination.total / 15));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search, page]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const handleApprove = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Approve ${name}?`,
      text: 'This will allow them to list products and receive orders.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Yes, approve',
    });
    if (!result.isConfirmed) return;
    await api.patch(`/admin/sellers/${id}/approve`);
    Swal.fire('Approved!', `${name}'s store is now live.`, 'success');
    fetchSellers();
  };

  const handleReject = async (id: string, name: string) => {
    const { value: reason } = await Swal.fire({
      title: `Reject ${name}?`,
      input: 'textarea',
      inputLabel: 'Reason (will be emailed to seller)',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Reject',
    });
    if (reason === undefined) return;
    await api.patch(`/admin/sellers/${id}/reject`, { reason });
    Swal.fire('Rejected', 'Seller has been notified.', 'info');
    fetchSellers();
  };

  const handleSuspend = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Suspend ${name}?`,
      text: 'Their products will be hidden until reactivated.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      confirmButtonText: 'Suspend',
    });
    if (!result.isConfirmed) return;
    await api.patch(`/admin/sellers/${id}/suspend`);
    Swal.fire('Suspended', `${name} has been suspended.`, 'warning');
    fetchSellers();
  };

  const handleCommission = async (seller: Seller) => {
    const { value: rate } = await Swal.fire({
      title: 'Update Commission Rate',
      input: 'number',
      inputValue: seller.commissionRate,
      inputAttributes: { min: '0', max: '100', step: '1' },
      inputLabel: `Commission % for ${seller.storeName}`,
      showCancelButton: true,
      confirmButtonText: 'Update',
    });
    if (rate === undefined) return;
    await api.patch(`/admin/sellers/${seller._id}/commission`, { commissionRate: Number(rate) });
    Swal.fire('Updated!', `Commission set to ${rate}%.`, 'success');
    fetchSellers();
  };

  const columns: Column<Seller>[] = [
    {
      key: 'seller',
      header: 'Seller',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {s.profilePic
              ? <img src={s.profilePic} alt={s.name} className="w-full h-full object-cover" />
              : <span className="text-gray-500 font-bold text-sm">{s.name[0]}</span>
            }
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{s.name}</p>
            <p className="text-xs text-gray-400">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'storeName',
      header: 'Store',
      render: (s) => <span className="font-medium text-blue-600">{s.storeName || '—'}</span>,
    },
    {
      key: 'sellerStatus',
      header: 'Status',
      render: (s) => <StatusBadge status={s.sellerStatus} />,
    },
    {
      key: 'commissionRate',
      header: 'Commission',
      render: (s) => (
        <button
          onClick={() => handleCommission(s)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {s.commissionRate}%
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (s) => <span className="text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s) => (
        <div className="flex items-center gap-1">
          {s.sellerStatus === 'pending' && (
            <>
              <button onClick={() => handleApprove(s._id, s.name)} title="Approve"
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                <CheckCircle size={16} />
              </button>
              <button onClick={() => handleReject(s._id, s.name)} title="Reject"
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <XCircle size={16} />
              </button>
            </>
          )}
          {s.sellerStatus === 'approved' && (
            <button onClick={() => handleSuspend(s._id, s.name)} title="Suspend"
              className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
              <Ban size={16} />
            </button>
          )}
          <a
            href={`/category/${s.storeName}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            title="View store"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={ADMIN_NAV} role="admin" userName="Admin" onLogout={() => { window.location.href = '/login'; }}>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-500 text-sm mt-1">Approve, reject, or manage seller accounts.</p>
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
            placeholder="Search sellers or stores..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={sellers}
          loading={loading}
          keyExtractor={s => s._id}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No sellers found."
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminSellersPage;
