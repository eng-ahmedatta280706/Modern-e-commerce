import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Users, Store, ShoppingBag, ListOrdered, FolderOpen, Tag, BarChart3, Settings, Search, Edit3, UserX } from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout.optimized';
import DataTable, { Column } from '../../../components/dashboard/DataTable.optimized';
import StatusBadge from '../../../components/dashboard/StatusBadge.optimized';
import api from '../../../services/api.optimized';

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

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'seller' | 'customer';
    isActive: boolean;
    createdAt: string;
    profilePic?: string;
    sellerStatus?: string;
}

const ROLE_OPTIONS: Array<'all' | 'admin' | 'seller' | 'customer'> = ['all', 'admin', 'seller', 'customer'];

const AdminUsersPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'seller' | 'customer'>(
        (searchParams.get('role') as any) ?? 'all'
    );
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '15' });
            if (roleFilter !== 'all') params.set('role', roleFilter);
            if (search.trim()) params.set('search', search.trim());
            const { data } = await api.get(`/admin/users?${params}`);
            setUsers(data.data ?? []);
            setTotal(data.pagination?.total ?? 0);
            setTotalPages(Math.max(1, Math.ceil((data.pagination?.total ?? 0) / 15)));
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message ?? 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, [page, roleFilter, search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (user: UserRow) => {
        const { value } = await Swal.fire({
            title: `Update ${user.name}`,
            input: 'select',
            inputOptions: {
                customer: 'Customer',
                seller: 'Seller',
                admin: 'Admin',
            },
            inputValue: user.role,
            showCancelButton: true,
            confirmButtonText: 'Save',
        });

        if (!value || value === user.role) return;
        await api.patch(`/admin/users/${user.id}`, { role: value });
        await fetchUsers();
    };

    const handleToggleActive = async (user: UserRow) => {
        const action = user.isActive ? 'deactivate' : 'reactivate';
        const { isConfirmed } = await Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`,
            text: user.isActive ? 'This will suspend their access.' : 'This will restore their access.',
            icon: user.isActive ? 'warning' : 'question',
            showCancelButton: true,
            confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        });

        if (!isConfirmed) return;
        await api.patch(`/admin/users/${user.id}`, { isActive: !user.isActive });
        await fetchUsers();
    };

    const columns: Column<UserRow>[] = [
        {
            key: 'name',
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-gray-500 text-sm">{user.name?.[0] ?? '?'}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => <StatusBadge status={user.role} size="sm" />,
        },
        {
            key: 'sellerStatus',
            header: 'Seller Status',
            render: (user) => user.role === 'seller' ? <StatusBadge status={user.sellerStatus ?? 'pending'} size="sm" /> : <span className="text-gray-300">—</span>,
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (user) => <StatusBadge status={user.isActive ? 'active' : 'inactive'} size="sm" />,
        },
        {
            key: 'createdAt',
            header: 'Joined',
            render: (user) => <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleRoleChange(user)}
                        className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                        title="Edit role"
                    >
                        <Edit3 size={15} />
                    </button>
                    <button
                        onClick={() => handleToggleActive(user)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title={user.isActive ? 'Deactivate' : 'Reactivate'}
                    >
                        <UserX size={15} />
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
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} accounts in the system.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search users..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-64 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1); }}
                        className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>{role === 'all' ? 'All roles' : role}</option>
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
                    data={users}
                    loading={loading}
                    keyExtractor={(user) => user.id}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    emptyMessage="No users found."
                />
            </div>
        </DashboardLayout>
    );
};

export default AdminUsersPage;
