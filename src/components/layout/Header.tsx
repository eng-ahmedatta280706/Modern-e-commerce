import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag,
} from 'lucide-react';
// import { useCart } from '../../contexts/CartContext';
import NavIcons from '../navigation/NavIcons';
import MegaMenu from '../navigation/MegaMenu';
import { useTranslate } from '../../hooks/userTranslate';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  // const { cartItems } = useCart();

  // const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      {/* Top bar */}
      <div className="bg-ink text-white text-xs text-center py-1.5 tracking-wide">
        {t("header.freeShipping")}
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4 rtl:flex-row-reverse">

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg text-ink-soft hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 rtl:flex-row-reverse shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
              <ShoppingBag size={18} />
            </span>
            <span className="font-extrabold text-xl tracking-tight text-ink">StyleStore</span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                className="w-full py-2.5 pl-4 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-ink placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
              />
              <button type="submit" className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Nav icons */}
          <NavIcons />
          {/* <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />

            <ProfileMenu>
              <button className="p-2 rounded-full hover:text-brand-600 hover:bg-gray-300 transition-colors">
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
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
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
