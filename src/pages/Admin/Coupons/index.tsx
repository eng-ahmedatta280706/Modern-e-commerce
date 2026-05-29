import React, { useState, useEffect, useCallback } from 'react';
import {
  Tag, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  LayoutDashboard, Users, Store, ShoppingBag,
  ListOrdered, FolderOpen, BarChart3, Settings,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
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

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minOrder: number;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const CouponFormModal: React.FC<{
  initial?: Partial<Coupon>;
  onSave: (data: Partial<Coupon>) => void;
  onClose: () => void;
}> = ({ initial = {}, onSave, onClose }) => {
  const [form, setForm] = useState({
    code:       initial.code       ?? '',
    type:       initial.type       ?? 'percentage',
    value:      initial.value      ?? 10,
    minOrder:   initial.minOrder   ?? 0,
    usageLimit: initial.usageLimit ?? '',
    expiresAt:  initial.expiresAt ? initial.expiresAt.split('T')[0] : '',
    isActive:   initial.isActive   ?? true,
  });

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">{initial._id ? 'Edit Coupon' : 'Create Coupon'}</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Coupon Code</label>
            <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
              className="w-full border rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. SAVE20" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="percentage">Percentage %</option>
              <option value="fixed">Fixed $</option>
              <option value="shipping">Free Shipping</option>
            </select>
          </div>
          {form.type !== 'shipping' && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {form.type === 'percentage' ? 'Discount %' : 'Discount $'}
              </label>
              <input type="number" value={form.value} min={0} max={form.type === 'percentage' ? 100 : undefined}
                onChange={e => set('value', Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Min Order ($)</label>
            <input type="number" value={form.minOrder} min={0}
              onChange={e => set('minOrder', Number(e.target.value))}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Usage Limit</label>
            <input type="number" value={form.usageLimit} min={1}
              onChange={e => set('usageLimit', e.target.value ? Number(e.target.value) : '')}
              placeholder="Unlimited"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Expires At</label>
            <input type="date" value={form.expiresAt}
              onChange={e => set('expiresAt', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Active</label>
            <button onClick={() => set('isActive', !form.isActive)}>
              {form.isActive
                ? <ToggleRight size={28} className="text-green-500" />
                : <ToggleLeft  size={28} className="text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave({ ...form, usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit) } as Partial<Coupon>)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-sm font-medium transition-colors">
            {initial._id ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons]   = useState<Coupon[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<Coupon | undefined>(undefined);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/coupons');
      setCoupons(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleSave = async (formData: Partial<Coupon>) => {
    try {
      if (editing?._id) {
        await api.patch(`/admin/coupons/${editing._id}`, formData);
      } else {
        await api.post('/admin/coupons', formData);
      }
      setModalOpen(false);
      setEditing(undefined);
      fetchCoupons();
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message ?? 'Failed to save coupon.', 'error');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    const result = await Swal.fire({
      title: `Delete coupon "${code}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/admin/coupons/${id}`);
    fetchCoupons();
  };

  const handleToggle = async (coupon: Coupon) => {
    await api.patch(`/admin/coupons/${coupon._id}`, { isActive: !coupon.isActive });
    fetchCoupons();
  };

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (c) => (
        <span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{c.code}</span>
      ),
    },
    {
      key: 'type',
      header: 'Discount',
      render: (c) => (
        <span className="text-sm font-medium text-gray-700">
          {c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? formatPrice(c.value) : 'Free Shipping'}
        </span>
      ),
    },
    {
      key: 'minOrder',
      header: 'Min Order',
      render: (c) => <span className="text-sm text-gray-600">{c.minOrder > 0 ? formatPrice(c.minOrder) : '—'}</span>,
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (c) => (
        <span className="text-sm text-gray-600">
          {c.usedCount} / {c.usageLimit ?? '∞'}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (c) => (
        <span className={`text-xs ${c.expiresAt && new Date(c.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
          {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Active',
      render: (c) => (
        <button onClick={() => handleToggle(c)}>
          {c.isActive
            ? <ToggleRight size={24} className="text-green-500" />
            : <ToggleLeft  size={24} className="text-gray-300" />}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditing(c); setModalOpen(true); }}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(c._id, c.code)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
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
      {modalOpen && (
        <CouponFormModal
          initial={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(undefined); }}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-500 text-sm mt-1">Manage discount codes and promotional offers.</p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Coupon
          </button>
        </div>

        <DataTable
          columns={columns}
          data={coupons}
          loading={loading}
          keyExtractor={c => c._id}
          emptyMessage="No coupons yet. Create your first one!"
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminCouponsPage;
