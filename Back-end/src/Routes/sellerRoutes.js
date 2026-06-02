import { Router } from 'express';
const router = Router();
import { getSellerDashboard, getStoreProfile, getMyProducts, getMyOrders } from '../controllers/sellerController.js';
import { getNotifications, markRead, deleteNotification } from '../controllers/notificationController.js';
import { create_Product, updateProduct, deleteProduct } from '../controllers/productController.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize, requireApprovedSeller } from '../middleware/auth.js';
// import { upload } from '../config/cloudinary';
import { uploadLimiter } from '../middleware/rateLimiter.js';

// All seller routes require auth + seller role
router.use(protect, authorize('seller'));

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', requireApprovedSeller, getSellerDashboard);

// ── Store profile ─────────────────────────────────────────
router.get('/profile', getStoreProfile);

// ── Products (seller-scoped) ──────────────────────────────
router.get('/products', requireApprovedSeller, getMyProducts);

router.post(
  '/products',
  requireApprovedSeller,
  uploadLimiter,
  // upload.array('images', 8),
  create_Product
);

router.put(
  '/products/:id',
  requireApprovedSeller,
  uploadLimiter,
  // upload.array('images', 8),
  updateProduct
);

router.delete('/products/:id', requireApprovedSeller, deleteProduct);

// ── Orders (seller-scoped) ────────────────────────────────
router.get('/orders', requireApprovedSeller, getMyOrders);
router.patch('/orders/:id/status', requireApprovedSeller, updateOrderStatus);

// ── Notifications ─────────────────────────────────────────
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markRead);
router.delete('/notifications/:id', deleteNotification);

export default router;
