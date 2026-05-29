// import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ProductPage from './components/product/ProductPage';
import WishlistPage from './pages/Wishlist/WishListPage';
import CategoryPage from './pages/Category/CategoryPage';
import SearchResultsPage from './pages/SearchResults/SearchResults';
import AccountPage from './pages/Account/AccountPage';
import SubcategoriesPage from './pages/Subcategory/SubcategoryPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import Layout from './components/layout/Layout';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import CheckoutWizard from './pages/Checkout/CheckoutPage';
import UserAccount from './pages/Account/AccountPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/category/:categorySlug/:subcategorySlug" element={<SubcategoriesPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutWizard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              </Routes>
            </Layout>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;