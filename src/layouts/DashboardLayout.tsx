import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: 'admin' | 'seller';
  userName: string;
  userAvatar?: string;
  storeName?: string;
  notificationCount?: number;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children, navItems, role, userName, userAvatar,
  storeName, notificationCount = 0, onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const roleColor = role === 'admin' ? 'bg-red-600' : 'bg-blue-600';
  const roleLabel = role === 'admin' ? 'Admin Panel' : 'Seller Dashboard';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`${roleColor} px-5 py-5`}>
        <Link to="/" className="flex items-center gap-2 text-white">
          <ShoppingBag size={22} />
          <div>
            <p className="font-bold text-sm leading-none">StyleStore</p>
            <p className="text-xs opacity-75 mt-0.5">{roleLabel}</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {userAvatar
              ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold text-sm">{userName[0]}</div>
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            {storeName && <p className="text-xs text-gray-500 truncate">{storeName}</p>}
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full text-white ${roleColor}`}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.href ||
            (item.href !== `/${role}` && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? `${roleColor} text-white shadow-sm`
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white flex flex-col shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb for desktop */}
          <div className="hidden lg:block text-sm text-gray-500">
            {navItems.find(n =>
              location.pathname === n.href ||
              (n.href !== `/${role}` && location.pathname.startsWith(n.href))
            )?.label ?? 'Dashboard'}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications bell */}
            <Link
              to={`/${role}/notifications`}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Back to store */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <ShoppingBag size={13} />
              Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
