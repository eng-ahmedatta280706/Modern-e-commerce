import { Router } from 'express';
const router = Router();
import { getDashboardStats, getUsers, getUser, updateUser, deleteUser, getSellers, approveSeller, rejectSeller, suspendSeller, updateSellerCommission, getAllOrders, getAllProducts, toggleProductFeatured, getCoupons, create_Coupon, update_Coupon, delete_Coupon } from '../controllers/adminController.js';
import { getCategories, create_Category, update_Category, delete_Category } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
// import { upload } from '../config/cloudinary';

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Users ─────────────────────────────────────────────────
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ── Sellers ───────────────────────────────────────────────
router.get('/sellers', getSellers);
router.patch('/sellers/:id/approve', approveSeller);
router.patch('/sellers/:id/reject', rejectSeller);
router.patch('/sellers/:id/suspend', suspendSeller);
router.patch('/sellers/:id/commission', updateSellerCommission);

// ── Orders ────────────────────────────────────────────────
router.get('/orders', getAllOrders);

// ── Products ──────────────────────────────────────────────
router.get('/products', getAllProducts);
router.patch('/products/:id/featured', toggleProductFeatured);

// ── Coupons ───────────────────────────────────────────────
router.get('/coupons', getCoupons);
router.post('/coupons', create_Coupon);
router.patch('/coupons/:id', update_Coupon);
router.delete('/coupons/:id', delete_Coupon);

// ── Categories ────────────────────────────────────────────
router.get('/categories', getCategories);
// router.post  ('/categories',     upload.single('image'), create_Category);
// router.patch ('/categories/:id', upload.single('image'), update_Category);
router.delete('/categories/:id', delete_Category);

export default router;
