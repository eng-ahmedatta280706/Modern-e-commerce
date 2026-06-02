import { Router } from 'express';
const router = Router();
import { getProducts, getProduct, create_Product, updateProduct, deleteProduct, add_Review, deleteReview } from '../controllers/productController.js';
import { protect, authorize, requireApprovedSeller } from '../middleware/auth.js';
// import { upload } from '../config/cloudinary';
import { uploadLimiter } from '../middleware/rateLimiter.js';

// ── Public ────────────────────────────────────────────────
router.get('/', getProducts);
router.get('/:id', getProduct);

// ── Seller / Admin — create ───────────────────────────────
router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  requireApprovedSeller,
  uploadLimiter,
  // upload.array('images', 8),
  create_Product
);

// ── Seller / Admin — update / delete ─────────────────────
router
  .route('/:id')
  .put(
    protect,
    authorize('seller', 'admin'),
    requireApprovedSeller,
    uploadLimiter,
    // upload.array('images', 8),
    updateProduct
  )
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

// ── Reviews ───────────────────────────────────────────────
router.post('/:id/reviews', protect, authorize('customer'), add_Review);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

export default router;
