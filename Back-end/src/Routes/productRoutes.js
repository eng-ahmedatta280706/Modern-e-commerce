import { Router } from 'express';
const router  = Router();
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, deleteReview } from '../controllers/productController';
import { protect, authorize, requireApprovedSeller } from '../middleware/auth';
import { upload } from '../config/cloudinary';
import { uploadLimiter } from '../middleware/rateLimiter';

// ── Public ────────────────────────────────────────────────
router.get('/',    getProducts);
router.get('/:id', getProduct);

// ── Seller / Admin — create ───────────────────────────────
router.post(
  '/',
  protect,
  authorize('seller', 'admin'),
  requireApprovedSeller,
  uploadLimiter,
  upload.array('images', 8),
  createProduct
);

// ── Seller / Admin — update / delete ─────────────────────
router
  .route('/:id')
  .put(
    protect,
    authorize('seller', 'admin'),
    requireApprovedSeller,
    uploadLimiter,
    upload.array('images', 8),
    updateProduct
  )
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

// ── Reviews ───────────────────────────────────────────────
router.post('/:id/reviews', protect, authorize('customer'), addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

export default router;
