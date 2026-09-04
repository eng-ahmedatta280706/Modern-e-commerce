import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Loading fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
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
// const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/PaymentPage'));
const AccountPage = lazy(() => import('../pages/Account/AccountPage'));
const OrdersPage = lazy(() => import('../pages/Orders/OrdersPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const SupportPage = lazy(() => import('../pages/Support/SupportPage'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminUsersPage = lazy(() => import('../pages/Admin/Users'));
const AdminSellersPage = lazy(() => import('../pages/Admin/Sellers'));
const AdminProductsPage = lazy(() => import('../pages/Admin/Products'));
const AdminOrdersPage = lazy(() => import('../pages/Admin/Orders'));
const AdminCategoriesPage = lazy(() => import('../pages/Admin/Categories'));
const AdminCouponsPage = lazy(() => import('../pages/Admin/Coupons'));
const AdminAnalyticsPage = lazy(() => import('../pages/Admin/Analytics'));
const AdminSettingsPage = lazy(() => import('../pages/Admin/Settings'));
const SellerDashboard = lazy(() => import('../pages/Seller/Dashboard'));
const SellerProductsPage = lazy(() => import('../pages/Seller/Products'));
const SellerOrdersPage = lazy(() => import('../pages/Seller/Orders'));
const SellerAnalyticsPage = lazy(() => import('../pages/Seller/Analytics'));
const SellerNotificationsPage = lazy(() => import('../pages/Seller/Notifications'));
const SellerProfilePage = lazy(() => import('../pages/Seller/Profile'));

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
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>
            } />
            <Route path="/admin/sellers" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminSellersPage /></ProtectedRoute>
            } />
            <Route path="/admin/products" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminProductsPage /></ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminOrdersPage /></ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminCategoriesPage /></ProtectedRoute>
            } />
            <Route path="/admin/coupons" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminCouponsPage /></ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>
            } />
            <Route path="/seller" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
            } />
            <Route path="/seller/products" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerProductsPage /></ProtectedRoute>
            } />
            <Route path="/seller/products/new" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerProductsPage /></ProtectedRoute>
            } />
            <Route path="/seller/orders" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerOrdersPage /></ProtectedRoute>
            } />
            <Route path="/seller/analytics" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerAnalyticsPage /></ProtectedRoute>
            } />
            <Route path="/seller/notifications" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerNotificationsPage /></ProtectedRoute>
            } />
            <Route path="/seller/profile" element={
                <ProtectedRoute allowedRoles={['seller']}><SellerProfilePage /></ProtectedRoute>
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
