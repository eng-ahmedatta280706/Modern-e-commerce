import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Loading fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
);

// Lazy-loaded pages — each page is a separate chunk
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductPage = lazy(() => import('../pages/ProductDetails/ProductPage'));
const ShopPage = lazy(() => import('../pages/Shop/ShopPage'));
const CategoryPage = lazy(() => import('../pages/Category/CategoryPage'));
const SubcategoryPage = lazy(() => import('../pages/Subcategory/SubcategoryPage'));
const SearchResults = lazy(() => import('../pages/SearchResults/SearchResults'));
const WishlistPage = lazy(() => import('../pages/Wishlist/WishListPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const AccountPage = lazy(() => import('../pages/Account/AccountPage'));
const OrdersPage = lazy(() => import('../pages/Orders/OrdersPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const SupportPage = lazy(() => import('../pages/Support/SupportPage'));

const AppRoutes: React.FC = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/category/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/support/:page" element={<SupportPage />} />

            {/* Protected routes */}
            <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            } />
            <Route path="/account" element={
                <ProtectedRoute><AccountPage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
);

export default AppRoutes;
