import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import MiniCart from '../ui/MiniCart';
import ProfileMenu from '../modals/ProfileModal';
import LanguageSwitcher from '../layout/LangSwitcher';
import { useTranslate } from '../../hooks/userTranslate';

const NavIcons: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { t } = useTranslate();

  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      <LanguageSwitcher />

      <ProfileMenu>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </ProfileMenu>

      <Link
        to="/wishlist"
        className="hidden md:flex p-2 rounded-full hover:text-red-600 hover:bg-gray-100 transition-colors"
        title={t('header.wishlist')}
        aria-label="Wishlist"
      >
        <Heart size={20} />
      </Link>

      <div className="relative">
        <button
          className="p-2 rounded-full hover:text-green-600 hover:bg-gray-100 transition-colors relative"
          onClick={() => setIsCartOpen(!isCartOpen)}
          aria-label={`Cart (${totalItems} items)`}
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 rtl:-left-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
        {isCartOpen && <MiniCart onClose={() => setIsCartOpen(false)} />}
      </div>
    </div>
  );
};

export default NavIcons;
