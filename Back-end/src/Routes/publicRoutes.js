import { Router } from 'express';
const router  = Router();
import { getCategories, getCategory } from '../controllers/categoryController';
import { validateCoupon } from '../controllers/couponController';
import { protect } from '../middleware/auth';

// ── Categories (public) ───────────────────────────────────
router.get('/categories',       getCategories);
router.get('/categories/:slug', getCategory);

// ── Coupon validation (customer, at checkout) ─────────────
router.post('/coupons/validate', protect, validateCoupon);

export default router;
