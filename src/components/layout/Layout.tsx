import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ["/checkout", "/wishlist", "/account" , "/login", "/register"];
  
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);
  
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const hideHeaderPaths = ["/checkout", "/wishlist", "/account"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname) && !isAuthPage;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default Layout;