import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag,
} from 'lucide-react';
// import { useCart } from '../../contexts/CartContext';
import NavIcons from '../navigation/NavIcons';
import MegaMenu from '../navigation/MegaMenu';
import { useTranslate } from '../../hooks/userTranslate';
import { CategoryKey } from '../../types/Category';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { cartItems } = useCart();

  // const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslate();


  const categories: CategoryKey[] = [
    "newArrivals",
    "women",
    "men",
    "kids",
    "accessories",
    "sale"
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs text-center py-1">
        {t("header.freeShipping")}
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between rtl:flex-row-reverse">

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <ShoppingBag className="text-orange-500" />
            <span className="font-bold text-xl tracking-tight">StyleStore</span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 rtl:left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Nav icons */}
          <NavIcons />
          {/* <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />

            <ProfileMenu>
              <button className="p-2 rounded-full hover:text-blue-600 hover:bg-gray-300 transition-colors">
                <User size={20} />
              </button>
            </ProfileMenu>

            <Link
              to="/wishlist"
              className="hidden md:block p-2 rounded-full hover:text-red-600 hover:bg-gray-300 transition-colors"
              title={t("header.wishlist")}
            >
              <Heart size={20} />
            </Link>

            <div className="relative">
              <button
                className="p-2 rounded-full hover:text-green-600 hover:bg-gray-300 transition-colors"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:-left-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isCartOpen && <MiniCart onClose={() => setIsCartOpen(false)} />}
            </div>
          </div> */}
        </div>

        {/* Categories nav - hidden on mobile unless menu is open */}
        <MegaMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        {/* Mobile search - visible only on mobile */}
        {/* <div className="mt-4 lg:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 rtl:left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Search size={18} />
            </button>
          </div>
        </div> */}
      </div>
    </header>
  );
};

export default Header;