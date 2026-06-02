import React, { useContext } from 'react';
import { LayoutDashboard, Users, Store, ShoppingBag, ListOrdered, FolderOpen, Tag, BarChart3, Settings, LogOut, ShieldCheck } from 'lucide-react';
import DashboardLayout, { NavItem } from '../../../components/dashboard/DashboardLayout';
import { AuthContext } from '../../../contexts/AuthContext';

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

const AdminSettingsPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const handleLogout = async () => {
    await auth?.logoutUser?.();
    window.location.href = '/login';
  };

  return (
    <DashboardLayout
      navItems={ADMIN_NAV}
      role="admin"
      userName={user?.name ?? 'Admin'}
      userAvatar={user?.profilePic}
      onLogout={handleLogout}
    >
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Quick account and platform settings.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Signed in as</p>
              <h2 className="text-xl font-bold text-gray-900">{user?.name ?? 'Admin'}</h2>
              <p className="text-sm text-gray-500">{user?.email ?? 'Administrator account'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">Role</p>
              <p className="mt-1 font-semibold text-gray-900">{user?.role ?? 'admin'}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">Account</p>
              <p className="mt-1 font-semibold text-gray-900">Active session</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
