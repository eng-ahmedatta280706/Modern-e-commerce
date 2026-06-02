import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Users, Store, ShoppingBag, ListOrdered, FolderOpen, Tag, BarChart3, Settings, Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import api from '../../../services/api';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Sellers', href: '/admin/sellers', icon: <Store size={18} /> },
  { label: 'Products', href: '/admin/products', icon: <ShoppingBag size={18} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ListOrdered size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <FolderOpen size={18} /> },
  { label: 'Coupons', href: '/admin/coupons', icon: <Tag size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  order?: number;
  isActive?: boolean;
  image?: string;
  productsCount?: number;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (category: CategoryRow) => {
    const { isConfirmed } = await Swal.fire({
      title: `Deactivate ${category.name}?`,
      text: 'This will hide the category from storefront navigation.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Deactivate',
    });

    if (!isConfirmed) return;
    await api.delete(`/admin/categories/${category._id}`);
    await fetchCategories();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) =>
      [category.name, category.slug].some((value) => value?.toLowerCase().includes(q))
    );
  }, [categories, search]);

  const columns: Column<CategoryRow>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
            {category.image ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" /> : null}
          </div>
          <div>
            <p className="font-medium text-gray-900">{category.name}</p>
            <p className="text-xs text-gray-400">/{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (category) => <span className="text-sm text-gray-600">{category.order ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (category) => <StatusBadge status={category.isActive ? 'active' : 'inactive'} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category) => (
        <button
          onClick={() => handleDelete(category)}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          title="Deactivate category"
        >
          <Trash2 size={15} />
        </button>
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 text-sm mt-1">Manage storefront categories and visibility.</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={(category) => category._id}
          emptyMessage="No categories found."
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminCategoriesPage;
