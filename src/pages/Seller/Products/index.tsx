import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Plus, Pencil, Trash2, Search,
  LayoutDashboard, ListOrdered, Bell, User2, BarChart3,
  AlertTriangle, Eye,
} from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import DataTable, { Column } from '../../../components/dashboard/DataTable';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import api from '../../../services/api';
import { formatPrice } from '../../../utils/formatPrice';
import Swal from 'sweetalert2';

const SELLER_NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/seller',               icon: <LayoutDashboard size={18} /> },
  { label: 'My Products',  href: '/seller/products',      icon: <ShoppingBag size={18} /> },
  { label: 'Orders',       href: '/seller/orders',        icon: <ListOrdered size={18} /> },
  { label: 'Analytics',    href: '/seller/analytics',     icon: <BarChart3 size={18} /> },
  { label: 'Notifications',href: '/seller/notifications', icon: <Bell size={18} /> },
  { label: 'Profile',      href: '/seller/profile',       icon: <User2 size={18} /> },
];

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  salePrice: number;
  stock: number;
  sold: number;
  badge: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  images: string[];
  createdAt: string;
}

const STATUS_TABS = ['all', 'active', 'inactive'] as const;

const ProductFormModal: React.FC<{
  initial?: Partial<Product>;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}> = ({ initial = {}, onSave, onClose }) => {
  const [form, setForm] = useState({
    name:        initial.name        ?? '',
    description: '',
    price:       initial.price       ?? '',
    discount:    initial.discount    ?? 0,
    category:    initial.category    ?? 'Men',
    subcategory: '',
    stock:       initial.stock       ?? '',
    badge:       initial.badge       ?? '',
    colors:      '',
    sizes:       '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach(f => fd.append('images', f));
    onSave(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 my-4">
        <h2 className="text-lg font-bold text-gray-900">
          {initial._id ? 'Edit Product' : 'Add New Product'}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Classic Cotton T-Shirt" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Product description..." />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Price ($) *</label>
            <input type="number" value={form.price} min={0} step="0.01"
              onChange={e => set('price', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Discount %</label>
            <input type="number" value={form.discount} min={0} max={100}
              onChange={e => set('discount', Number(e.target.value))}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['Men', 'Women', 'Kids', 'Shoes', 'Accessories'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Stock *</label>
            <input type="number" value={form.stock} min={0}
              onChange={e => set('stock', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Badge</label>
            <select value={form.badge} onChange={e => set('badge', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">None</option>
              <option value="New">New</option>
              <option value="Sale">Sale</option>
              <option value="Best Seller">Best Seller</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Colors (comma-separated)</label>
            <input value={form.colors} onChange={e => set('colors', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Black, White, Red" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Images (up to 8)</label>
            <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files ?? []))}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {files.length > 0 && <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-sm font-medium transition-colors">
            {initial._id ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SellerProductsPage: React.FC = () => {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Product | undefined>(undefined);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search)                   params.set('search', search);
      if (statusFilter !== 'all')   params.set('status', statusFilter);
      const { data } = await api.get(`/seller/products?${params}`);
      setProducts(data.data);
      setTotal(data.pagination.total);
      setTotalPages(Math.ceil(data.pagination.total / 12));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSave = async (formData: FormData) => {
    try {
      if (editing?._id) {
        await api.put(`/seller/products/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/seller/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      setEditing(undefined);
      fetchProducts();
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message ?? 'Failed to save product.', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Remove "${name}"?`,
      text: 'This will hide the product from your store.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Remove',
    });
    if (!result.isConfirmed) return;
    await api.delete(`/seller/products/${id}`);
    fetchProducts();
  };

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{p.name}</p>
            <p className="text-xs text-gray-400">{p.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (p) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{formatPrice(p.salePrice || p.price)}</p>
          {p.discount > 0 && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <div className="flex items-center gap-1">
          {p.stock <= 5 && <AlertTriangle size={13} className="text-orange-500" />}
          <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-orange-600' : 'text-gray-700'}`}>
            {p.stock}
          </span>
        </div>
      ),
    },
    { key: 'sold', header: 'Sold', render: (p) => <span className="text-sm text-gray-600">{p.sold}</span> },
    {
      key: 'badge',
      header: 'Badge',
      render: (p) => p.badge ? <StatusBadge status={p.badge.toLowerCase().replace(' ', '-')} size="sm" /> : <span className="text-gray-300 text-xs">—</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (p) => (
        <span className="text-sm text-gray-700">
          {p.rating > 0 ? `${p.rating}★ (${p.numReviews})` : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-1">
          <Link to={`/product/${p._id}`} target="_blank"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" title="View">
            <Eye size={15} />
          </Link>
          <button onClick={() => { setEditing(p); setModalOpen(true); }}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(p._id, p.name)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
            <Trash2 size={15} />
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
      {modalOpen && (
        <ProductFormModal
          initial={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(undefined); }}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} total products</p>
          </div>
          <button
            onClick={() => { setEditing(undefined); setModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* Tabs + search */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {STATUS_TABS.map(tab => (
              <button key={tab}
                onClick={() => { setStatus(tab); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${statusFilter === tab ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          keyExtractor={p => p._id}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No products yet. Add your first product!"
        />
      </div>
    </DashboardLayout>
  );
};

export default SellerProductsPage;
