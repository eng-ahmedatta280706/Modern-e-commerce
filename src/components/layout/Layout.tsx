import React from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const routesToHide = [
  '/checkout',
  '/login',
  '/register',
  '/account',
  '/wishlist',
  '/search',
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const hideExact = routesToHide.includes(path);
  const hideCategory = path.startsWith('/category/');

  // detect unmatched routes
  const matched = matchRoutes(
    [
      { path: '/' },
      { path: '/product/:id' },
      { path: '/category/:categorySlug' },
      { path: '/category/:categorySlug/:subcategorySlug' },
      { path: '/search' },
      { path: '/wishlist' },
      { path: '/checkout' },
      { path: '/login' },
      { path: '/register' },
      { path: '/account' },
    ],
    location
  );

  const isNotFound = !matched;

  const showHeader = !(hideExact || hideCategory || isNotFound);
  const showFooter = !(hideExact || hideCategory || isNotFound);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}

      <main className="flex-grow">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;