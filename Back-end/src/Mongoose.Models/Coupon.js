import { Schema, model } from 'mongoose';

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed', 'shipping'], required: true },
  value: { type: Number, default: 0 },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // cap for percentage coupons
  usageLimit: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

couponSchema.methods.isExpired = function () {
  return this.expiresAt &&
    this.expiresAt < new Date();
};

couponSchema.methods.canBeUsed = function () {

  if (!this.isActive)
    return false;

  if (this.isExpired())
    return false;

  if (
    this.usageLimit &&
    this.usedCount >= this.usageLimit
  )
    return false;

  return true;
};

couponSchema.methods.calculateDiscount = function (subtotal, shippingCost = 0) {
  if (!this.canBeUsed())
    return 0;
  if (subtotal < this.minOrder)
    return 0;

  let discount = 0;
  if (this.type === 'percentage') {
    discount = subtotal * this.value / 100;
    if (this.maxDiscount) {
      discount = Math.min(
        discount,
        this.maxDiscount
      );
    }
  } else if (this.type === 'fixed') {
    discount = Math.min(
      this.value,
      subtotal
    );
  } else if (this.type === 'shipping') {
    discount = shippingCost;
  }
  return +discount.toFixed(2);
};

export const COUPON_TYPES = ['percentage', 'fixed', 'shipping'];
export const MAX_DISCOUNT = 100; // Max discount in dollars
export const MAX_DISCOUNT_PERCENTAGE = 50; // Max discount in percentage
export const MAX_COUPON_DISCOUNT = 50; // Max discount from coupon in dollars
export const MAX_COUPON_DISCOUNT_PERCENTAGE = 30; // Max discount from coupon in percentage
export const MAX_SHIPPING_DISCOUNT = 15; // Max shipping discount in dollars

export const createCoupon = async (data) => {
  if (data.type === 'percentage') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT);
  }
  return await model('Coupon').create(data);
};

export const updateCoupon = async (id, data) => {
  if (data.type === 'percentage') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT);
  }
  return await model('Coupon').findByIdAndUpdate(id, data, { new: true }).exec();
};

export const find = async (filter, options = {}) => {
  const query = model('Coupon').find(filter);
  if (options.sort) query.sort(options.sort);
  if (options.skip) query.skip(options.skip);
  if (options.limit) query.limit(options.limit);
  return await query.exec();
};

export const findOne = async (filter) => {
  return await model('Coupon').findOne(filter).exec();
};

export const findById = async (id) => {
  return await model('Coupon').findById(id).exec();
};

export const findByIdAndUpdate = async (id, data) => {
  if (data.type === 'percentage') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT);
  }
  return await model('Coupon').findByIdAndUpdate(id, data, { new: true }).exec();
};

export const countCoupons = async (filter) => {
  return await model('Coupon').countDocuments(filter).exec();
};

export const create = async (data) => {
  if (data.type === 'percentage') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT_PERCENTAGE);
  } else if (data.type === 'fixed') {
    data.value = Math.min(data.value, MAX_COUPON_DISCOUNT);
  }
  return await model('Coupon').create(data);
};

export const deleteCoupon = async (id) => {
  return await model('Coupon').findByIdAndDelete(id).exec();
};

export const incrementUsage = async (couponId) => {
  return await model('Coupon').findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } }, { new: true }).exec();
};


export default model('Coupon', couponSchema);