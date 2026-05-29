import { findOne } from '../models/Coupon';
import { AppError } from '../middleware/errorHandler';

// POST /coupons/validate — customer applies a coupon code at checkout
export async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    if (!code) return next(new AppError('Coupon code is required.', 400));

    const coupon = await findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) return next(new AppError('Invalid coupon code.', 400));

    // Expiry check
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return next(new AppError('This coupon has expired.', 400));
    }

    // Usage limit check
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return next(new AppError('This coupon has reached its usage limit.', 400));
    }

    // Minimum order check
    if (subtotal && Number(subtotal) < coupon.minOrder) {
      return next(
        new AppError(`Minimum order of $${coupon.minOrder.toFixed(2)} required for this coupon.`, 400)
      );
    }

    // Calculate discount preview
    let discount = 0;
    if (coupon.type === 'percentage' && coupon.value) {
      discount = (Number(subtotal) * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === 'fixed' && coupon.value) {
      discount = Math.min(coupon.value, Number(subtotal) || coupon.value);
    } else if (coupon.type === 'shipping') {
      discount = 0; // shipping waived — exact amount depends on shipping method
    }

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
