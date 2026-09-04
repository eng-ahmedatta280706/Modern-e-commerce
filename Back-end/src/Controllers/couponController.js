import { findCouponOne, calculateDiscount } from '../Models/Coupon.js';
import errorHandler from '../Middleware/errorHandler.js';

const { AppError } = errorHandler;

// POST /coupons/validate — customer applies a coupon code at checkout
export async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    if (!code) return next(new AppError('Coupon code is required.', 400));

    const coupon = await findCouponOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) return next(new AppError('Invalid coupon code.', 400));

    // Expiry check
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return next(new AppError('This coupon has expired.', 400));
    }

    // Usage limit check
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return next(new AppError('This coupon has reached its usage limit.', 400));
    }

    // Minimum order check
    if (subtotal && Number(subtotal) < Number(coupon.minOrder)) {
      return next(
        new AppError(`Minimum order of $${Number(coupon.minOrder).toFixed(2)} required for this coupon.`, 400)
      );
    }

    // Calculate discount preview using helper
    const discount = await calculateDiscount(coupon.id, Number(subtotal), 0);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: +discount.toFixed(2),
        message:
          coupon.type === 'shipping'
            ? 'Free shipping applied!'
            : `Coupon applied — you save $${discount.toFixed(2)}!`,
      },
    });
  } catch (err) { next(err); }
}
