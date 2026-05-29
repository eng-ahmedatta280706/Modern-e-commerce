export type CouponType = 'percentage' | 'fixed' | 'shipping';

export interface Coupon {
  code: string;
  type: CouponType;
  value?: number;
  minOrder?: number;
  expiresAt?: string;
}

export const VALID_COUPONS: Coupon[] = [
  { code: 'SAVE10', type: 'percentage', value: 10 },
  { code: 'DISCOUNT50', type: 'fixed', value: 50 },
  { code: 'FREESHIP', type: 'shipping' },
];

export const applyCouponDiscount = (
  coupon: Coupon,
  subtotal: number,
  shippingCost: number
): number => {
  if (coupon.type === 'percentage' && coupon.value) {
    return (subtotal * coupon.value) / 100;
  }
  if (coupon.type === 'fixed' && coupon.value) {
    return Math.min(subtotal, coupon.value);
  }
  if (coupon.type === 'shipping') {
    return shippingCost;
  }
  return 0;
};
