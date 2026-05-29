import { Router } from 'express';
const router  = Router();
import { getDashboardStats, getUsers, getUser, updateUser, deleteUser, getSellers, approveSeller, rejectSeller, suspendSeller, updateSellerCommission, getAllOrders, getAllProducts, toggleProductFeatured, getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/adminController';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../config/cloudinary';

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Users ─────────────────────────────────────────────────
router.get   ('/users',        getUsers);
router.get   ('/users/:id',    getUser);
router.patch ('/users/:id',    updateUser);
router.delete('/users/:id',    deleteUser);

// ── Sellers ───────────────────────────────────────────────
router.get   ('/sellers',                  getSellers);
router.patch ('/sellers/:id/approve',      approveSeller);
router.patch ('/sellers/:id/reject',       rejectSeller);
router.patch ('/sellers/:id/suspend',      suspendSeller);
router.patch ('/sellers/:id/commission',   updateSellerCommission);

// ── Orders ────────────────────────────────────────────────
router.get('/orders', getAllOrders);

// ── Products ──────────────────────────────────────────────
router.get   ('/products',                    getAllProducts);
router.patch ('/products/:id/featured',       toggleProductFeatured);

// ── Coupons ───────────────────────────────────────────────
router.get   ('/coupons',     getCoupons);
router.post  ('/coupons',     createCoupon);
router.patch ('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// ── Categories ────────────────────────────────────────────
router.get   ('/categories',     getCategories);
router.post  ('/categories',     upload.single('image'), createCategory);
router.patch ('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
