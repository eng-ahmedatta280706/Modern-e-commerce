import { Router } from 'express';
const router = Router();
import { getCategories, getCategory } from '../Controllers/categoryController.js';
import { validateCoupon } from '../Controllers/couponController.js';
import { protect } from '../Middleware/auth.js';

// ── Categories (public) ───────────────────────────────────
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategory);

// ── Coupon validation (customer, at checkout) ─────────────
router.post('/coupons/validate', protect, validateCoupon);

export default router;
