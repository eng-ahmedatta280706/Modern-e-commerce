import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, Heart, Settings,
  MapPin, Phone, Mail, ChevronRight,
} from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';
import { CartContext } from '../../contexts/CartContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { DEFAULT_GUEST_USER } from '../../types/User';
import { formatPrice } from '../../utils/formatPrice';

const QUICK_LINKS = [
  { icon: Package, label: 'My Orders', href: '/orders', count: null },
  { icon: Heart,   label: 'Wishlist',  href: '/wishlist', count: null },
  { icon: Settings,label: 'Settings',  href: '/account', count: null },
];

const AccountPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const cartContext = useContext(CartContext);

  if (!cartContext) throw new Error('AccountPage must be inside CartProvider');

  // ✅ Use real UserContext data, fall back to guest
  const user = userContext?.user ?? DEFAULT_GUEST_USER;
  const { cartItems, subtotal } = cartContext;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">@{user.username ?? user.email}</p>

            <div className="mt-4 space-y-2 text-left">
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            <button className="mt-5 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-5">
          {/* Quick links */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="divide-y divide-gray-100">
              {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="flex items-center justify-between py-3 hover:text-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <Icon size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Cart summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Cart Summary</h3>
              <Link to="/checkout" className="text-sm text-blue-600 hover:underline">
                Checkout
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div
                      key={`${item.id}-${item.selectedColor}`}
                      className="flex items-center gap-3"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.selectedColor} · x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                  <span className="font-semibold text-gray-900">Subtotal</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(subtotal)}</span>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Orders', value: user.ordersCount ?? 0 },
              { label: 'Cart Items', value: cartItems.length },
              { label: 'Wishlisted', value: '–' },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
