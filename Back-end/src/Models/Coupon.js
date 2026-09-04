import { db } from '../configs/db.js';
import { Coupons } from './schema.js';
import { eq, and } from 'drizzle-orm';

export const COUPON_TYPES = ['percentage', 'fixed', 'shipping'];
export const MAX_DISCOUNT = 100;
export const MAX_DISCOUNT_PERCENTAGE = 50;
export const MAX_COUPON_DISCOUNT = 50;
export const MAX_COUPON_DISCOUNT_PERCENTAGE = 30;
export const MAX_SHIPPING_DISCOUNT = 15;

// Coupon Creation
export async function createCoupon(data) {
  // Validate value limits
  if (data.type === 'percentage') {
    data.value = Math.min(Number(data.value), MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(Number(data.value), MAX_COUPON_DISCOUNT);
  }

  const [result] = await db.insert(Coupons).values({
    ...data,
    code: data.code.toUpperCase(),
  }).returning();
  return result;
}

// Coupon Queries
export async function findCouponById(id) {
  const [result] = await db.select().from(Coupons).where(eq(Coupons.id, id));
  return result || null;
}

export async function findCouponOne(filter) {
  let query = db.select().from(Coupons);

  const conditions = [];
  if (filter.code) conditions.push(eq(Coupons.code, filter.code.toUpperCase()));
  if (filter.isActive !== undefined) conditions.push(eq(Coupons.isActive, filter.isActive));
  if (conditions.length) query = query.where(and(...conditions));

  const results = await query;
  return results[0] || null;
}

export async function findCoupons(filter = {}) {
  let query = db.select().from(Coupons);

  if (filter.isActive !== undefined) {
    query = query.where(eq(Coupons.isActive, filter.isActive));
  }

  return await query;
}

// Coupon Updates
export async function updateCoupon(id, data) {
  // Validate value limits
  if (data.type === 'percentage') {
    data.value = Math.min(Number(data.value), MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(Number(data.value), MAX_COUPON_DISCOUNT);
  }

  data.updatedAt = new Date();
  const [result] = await db.update(Coupons).set(data).where(eq(Coupons.id, id)).returning();
  return result;
}

export async function findByIdAndUpdate(id, data) {
  return updateCoupon(id, data);
}

// Coupon Status
export async function deleteCoupon(id) {
  return await db.delete(Coupons).where(eq(Coupons.id, id));
}

// Coupon Validation
export async function isExpired(couponId) {
  const coupon = await findCouponById(couponId);
  if (!coupon) return true;
  return coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false;
}

export async function canCouponBeUsed(couponId) {
  const coupon = await findCouponById(couponId);
  if (!coupon) return false;
  if (!coupon.isActive) return false;
  if (await isExpired(couponId)) return false;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
  return true;
}

export async function calculateDiscount(
  couponId,
  subtotal,
  shippingCost = 0
) {
  if (!(await canCouponBeUsed(couponId))) return 0;

  const coupon = await findCouponById(couponId);
  if (!coupon) return 0;

  if (subtotal < Number(coupon.minOrder)) return 0;

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = subtotal * Number(coupon.value) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }
  } else if (coupon.type === 'fixed') {
    discount = Math.min(Number(coupon.value), subtotal);
  } else if (coupon.type === 'shipping') {
    discount = shippingCost;
  }
  return parseFloat(discount.toFixed(2));
}

// Usage Tracking
export async function incrementCouponUsage(couponId) {
  const coupon = await findCouponById(couponId);
  if (!coupon) throw new Error('Coupon not found');

  const newUsedCount = coupon.usedCount + 1;
  return await updateCoupon(couponId, {
    usedCount: newUsedCount,
  });
}

// Count Coupons
export async function countCoupons(filter = {}) {
  const results = await findCoupons(filter);
  return results.length;
}
