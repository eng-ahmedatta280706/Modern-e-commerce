import { Router } from 'express';
const router = Router();
import { getCategories, getCategory } from '../controllers/categoryController.js';
import { validateCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';

// ── Categories (public) ───────────────────────────────────
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategory);

// ── Coupon validation (customer, at checkout) ─────────────
router.post('/coupons/validate', protect, validateCoupon);

export default router;
