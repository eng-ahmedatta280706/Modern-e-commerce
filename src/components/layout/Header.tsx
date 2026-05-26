import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ShoppingCart, Menu, X, Heart,
  ChevronDown, ShoppingBag, User, Globe
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import MiniCart from '../ui/MiniCart';
import ProfileMenu from '../ui/ProfileModal';
import LanguageSwitcher from './LangSwitcher';
import { useTranslate } from '../../hooks/userTranslate';
import { subCategories } from "../../data/categories";
import { CategoryKey } from '../../types/Category';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
          </div>
        </div>

        {/* Categories nav - hidden on mobile unless menu is open */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block mt-4`}>
          <ul className="flex flex-col lg:flex-row lg:justify-center space-y-2 lg:space-y-0 lg:space-x-8 rtl:space-x-reverse">
            {categories.map((category) => (
              <li key={category} className="group relative">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors">
                  {t(`header.categories.${category}`)}
                  <ChevronDown size={16} className="ChevronDown ml-1 rtl:ml-0 rtl:mr-1" />
                </Link>
                <div className="hidden group-hover:grid absolute top-full left-1/2 -transform -translate-x-1/2 bg-white shadow-xl rounded-xl p-6 grid-cols-3 gap-8 w-[700px] z-50">
                  {Object.entries(subCategories[category]).map(
                    ([section, items]) => (
                      <div key={section}>
                        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">
                          {section}
                        </h3>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to="/"
                                className="block text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile search - visible only on mobile */}
        <div className="mt-4 lg:hidden">
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
      </div>
    </header>
  );
};

export default Header;