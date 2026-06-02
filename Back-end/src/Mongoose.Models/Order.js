import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedColor: String,
  selectedSize: String,
}, { _id: true });

const addressSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
}, { _id: false });

const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],

  shippingAddress: addressSchema,
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    default: 'standard',
  },
  shippingCost: { type: Number, default: 5 },

  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'cod', 'stripe'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: String,

  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },

  couponCode: String,

  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },

  trackingNumber: String,
  notes: String,
  deliveredAt: Date,
  cancelledAt: Date,
}, { timestamps: true });

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
export const PAYMENT_METHODS = ['card', 'paypal', 'cod', 'stripe'];
export const SHIPPING_METHODS = ['standard', 'express', 'pickup'];
export const TAX_RATE = 0.10;
export const SHIPPING_COSTS = { standard: 5, express: 15, pickup: 0 };
export const MAX_DISCOUNT = 100; // Max discount in dollars
export const MAX_DISCOUNT_PERCENTAGE = 50; // Max discount in percentage
export const MAX_COUPON_DISCOUNT = 50; // Max discount from coupon in dollars
export const MAX_COUPON_DISCOUNT_PERCENTAGE = 30; // Max discount from coupon in percentage
export const MAX_SHIPPING_DISCOUNT = 15; // Max shipping discount in dollars
export const MAX_ORDER_TOTAL = 10000; // Max order total in dollars
export const MIN_ORDER_TOTAL = 1; // Min order total in dollars
export const MAX_ORDER_QUANTITY = 100; // Max quantity per product in an order
export const MAX_ORDER_ITEMS = 20; // Max different products in an order
export const MAX_COUPON_USAGE = 1000; // Max times a coupon can be used

// Static methods
orderSchema.statics.createOrder = async function (orderData) {
  const { items, shippingAddress, shippingMethod, paymentMethod, couponCode, notes } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  // Validate items and calculate subtotal
  let subtotal = 0;
  for (const item of items) {
    const product = await this.model('Product').findById(item.product);
    if (!product || !product.isActive) {
      throw new Error(`Product not available: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for: ${product.name}`);
    }
    subtotal += (product.salePrice || product.price) * item.quantity;
  }

  const shippingCost = SHIPPING_COSTS[shippingMethod] || SHIPPING_COSTS.standard;
  const tax = +(subtotal * TAX_RATE).toFixed(2);

  // Calculate discount from coupon
  let discount = 0;
  if (couponCode) {
    const coupon = await this.model('Coupon').findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      throw new Error('Invalid or expired coupon code.');
    }
    if (subtotal < coupon.minOrder) {
      throw new Error(`Minimum order of $${coupon.minOrder} required for this coupon.`);
    }
    if (coupon.type === 'percentage') {
      discount = Math.min(subtotal * coupon.value / 100, MAX_COUPON_DISCOUNT_PERCENTAGE * subtotal / 100);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, MAX_COUPON_DISCOUNT);
    } else if (coupon.type === 'shipping') {
      discount = Math.min(shippingCost, MAX_SHIPPING_DISCOUNT);
    }
    discount = +discount.toFixed(2);
  }

  const total = +(subtotal + shippingCost + tax - discount).toFixed(2);

  if (total < MIN_ORDER_TOTAL || total > MAX_ORDER_TOTAL) {
    throw new Error(`Order total must be between $${MIN_ORDER_TOTAL} and $${MAX_ORDER_TOTAL}.`);
  }

  const order = new this({
    customer: orderData.customer,
    items,
    shippingAddress,
    shippingMethod,
    shippingCost,
    paymentMethod,
    subtotal,
    tax,
    discount,
    total,
    couponCode,
    notes,
  });

  await order.save();
  return order;
};

orderSchema.virtual('itemCount').get(function () {
  return this.items.reduce(
    (sum, item) =>
      sum + item.quantity
    , 0);
});

orderSchema.methods.markPaid = function (paymentIntentId = null) {
  this.paymentStatus = 'paid';
  if (paymentIntentId) {
    this.stripePaymentIntentId =
      paymentIntentId;
  }
  return this;
};

orderSchema.methods.cancelOrder = function () {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  return this;
};

orderSchema.statics.getRevenue = async function () {
  const result =
    await this.aggregate([
      {
        $match: {
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$total'
          }
        }
      }
    ]);
  return result[0]?.total || 0;
};

export const create = async function (orderData) {
  const order = new this(orderData);
  await order.save();
  return order;
};

export const find = async function (filter, options = {}) {
  const query = this.find(filter);

  if (options.sort) {
    query.sort(options.sort);
  }
  if (options.skip) {
    query.skip(options.skip);
  }
  if (options.limit) {
    query.limit(options.limit);
  }

  return await query.exec();
};

export const findOrderById = async function (id) {
  return await this.findById(id).exec();
};

export const countOrders = async function (filter) {
  return await this.countDocuments(filter);
};

export const updateOrder = async function (id, updateData) {
  const order = await this.findById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  Object.assign(order, updateData);
  await order.save();
  return order;
};

export const deleteOrder = async function (id) {
  return await this.findByIdAndDelete(id).exec();
};

export const cancelOrder = async function (id) {
  const order = await this.findOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  return order;
};

export const aggregate = async function (pipeline) {
  return await this.aggregate(pipeline).exec();
};

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.seller': 1 });

export default model('Order', orderSchema);
