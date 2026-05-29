import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Search, Star, Trash2,
  Eye, LayoutDashboard, Users, Store,
  ListOrdered, Tag, FolderOpen, BarChart3, Settings,
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

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  badge: string;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  images: string[];
  seller: { name: string; storeName: string };
  createdAt: string;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search)   params.set('search', search);
      if (category) params.set('category', category);
      const { data } = await api.get(`/admin/products?${params}`);
      setProducts(data.data);
      setTotal(data.pagination.total);
      setTotalPages(Math.ceil(data.pagination.total / 15));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await api.patch(`/admin/products/${id}/featured`);
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isFeatured: !current } : p));
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Remove "${name}"?`,
      text: 'The product will be hidden from the store.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Remove',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {p.images?.[0] && (
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{p.name}</p>
            <p className="text-xs text-gray-400">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'seller',
      header: 'Seller',
      render: (p) => (
        <span className="text-xs text-blue-600 font-medium">{p.seller?.storeName ?? p.seller?.name}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (p) => <span className="font-semibold">{formatPrice(p.price)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-red-600' : p.stock <= 20 ? 'text-orange-500' : 'text-gray-700'}`}>
          {p.stock}
        </span>
      ),
    },
    { key: 'sold', header: 'Sold', render: (p) => <span className="text-sm text-gray-600">{p.sold}</span> },
    {
      key: 'badge',
      header: 'Badge',
      render: (p) => p.badge ? <StatusBadge status={p.badge.toLowerCase()} size="sm" /> : <span className="text-gray-300">—</span>,
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (p) => (
        <button
          onClick={() => handleToggleFeatured(p._id, p.isFeatured)}
          className={`p-1.5 rounded-lg transition-colors ${p.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'}`}
          title={p.isFeatured ? 'Remove from featured' : 'Add to featured'}
        >
          <Star size={16} fill={p.isFeatured ? 'currentColor' : 'none'} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/product/${p._id}`}
            target="_blank"
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="View product"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => handleDelete(p._id, p.name)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Remove product"
          >
            <Trash2 size={16} />
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} total products across all sellers.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {['Men', 'Women', 'Kids', 'Shoes', 'Accessories'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          keyExtractor={p => p._id}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No products found."
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminProductsPage;
