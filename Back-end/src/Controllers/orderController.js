const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { create, find, countDocuments, findById } from '../models/Order';
import { findById as _findById, findByIdAndUpdate } from '../models/Product';
import { find as _find } from '../models/User';
import { findOne } from '../models/Coupon';
import { AppError } from '../middleware/errorHandler';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService';
import { notifyNewOrder, notifySellerNewOrder } from '../services/notificationService';

const SHIPPING_COSTS = { standard: 5, express: 15, pickup: 0 };
const TAX_RATE = 0.10;

// ── POST /orders ─────────────────────────────────────────
export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, shippingMethod = 'standard',
            paymentMethod, couponCode, notes } = req.body;

    if (!items?.length) return next(new AppError('Order must contain items.', 400));

    // Validate each item and get up-to-date prices from DB
    const orderItems = [];
    for (const item of items) {
      const product = await _findById(item.product);
      if (!product || !product.isActive)
        return next(new AppError(`Product not available: ${item.product}`, 400));
      if (product.stock < item.quantity)
        return next(new AppError(`Insufficient stock for: ${product.name}`, 400));

      orderItems.push({
        product:      product._id,
        seller:       product.seller,
        name:         product.name,
        image:        product.images?.[0] ?? '',
        price:        product.salePrice || product.price,
        quantity:     item.quantity,
        selectedColor:item.selectedColor ?? '',
        selectedSize: item.selectedSize  ?? '',
      });
    }

    const subtotal     = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = SHIPPING_COSTS[shippingMethod] ?? 5;
    const tax          = +(subtotal * TAX_RATE).toFixed(2);

    // Coupon discount
    let discount = 0;
    let usedCoupon = null;
    if (couponCode) {
      const coupon = await findOne({
        code: couponCode.toUpperCase(), isActive: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
        $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
      });
      if (!coupon) return next(new AppError('Invalid or expired coupon code.', 400));
      if (subtotal < coupon.minOrder)
        return next(new AppError(`Minimum order of $${coupon.minOrder} required.`, 400));

      if (coupon.type === 'percentage') {
        discount = Math.min(subtotal * coupon.value / 100, coupon.maxDiscount || Infinity);
      } else if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === 'shipping') {
        discount = shippingCost;
      }
      discount  = +discount.toFixed(2);
      usedCoupon = coupon;
    }

    const total = +(subtotal + shippingCost + tax - discount).toFixed(2);

    const order = await create({
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      tax,
      discount,
      total,
      couponCode: usedCoupon?.code,
      notes,
    });

    // Decrement stock
    await Promise.all(orderItems.map(i =>
      findByIdAndUpdate(i.product, {
        $inc: { stock: -i.quantity, sold: i.quantity },
      })
    ));

    // Increment coupon usage
    if (usedCoupon) {
      usedCoupon.usedCount += 1;
      await usedCoupon.save();
    }

    // Notify admins + sellers
    const admins = await _find({ role: 'admin' }).select('_id');
    await Promise.all(admins.map(a => notifyNewOrder(a._id, order)));

    // Group items by seller and notify each seller
    const sellerMap = {};
    orderItems.forEach(i => {
      const sid = String(i.seller);
      if (!sellerMap[sid]) sellerMap[sid] = [];
      sellerMap[sid].push(i);
    });
    await Promise.all(
      Object.entries(sellerMap).map(([sellerId, sellerItems]) =>
        notifySellerNewOrder(sellerId, order, sellerItems)
      )
    );

    await sendOrderConfirmationEmail(req.user, order).catch(() => null);

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
}

// ── GET /orders (customer: own orders) ───────────────────
export async function getMyOrders(req, res, next) {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const filter = { customer: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .populate('items.product', 'name images'),
      countDocuments(filter),
    ]);
    res.json({ success: true, data: orders, pagination: { page, limit, total } });
  } catch (err) { next(err); }
}

// ── GET /orders/:id ───────────────────────────────────────
export async function getOrder(req, res, next) {
  try {
    const order = await findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name images');
    if (!order) return next(new AppError('Order not found.', 404));

    // Customers can only see their own
    if (req.user.role === 'customer' && String(order.customer._id) !== String(req.user._id)) {
      return next(new AppError('Not authorized.', 403));
    }
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

// ── PATCH /orders/:id/status (admin / seller) ────────────
export async function updateOrderStatus(req, res, next) {
  try {
    const { status, trackingNumber } = req.body;
    const order = await findById(req.params.id).populate('customer', 'name email');
    if (!order) return next(new AppError('Order not found.', 404));

    const validTransitions = {
      pending:    ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped:    ['delivered'],
      delivered:  ['refunded'],
      cancelled:  [],
      refunded:   [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return next(new AppError(`Cannot move from ${order.status} to ${status}.`, 400));
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'cancelled') order.cancelledAt = new Date();

    await order.save();

    // Restore stock on cancel
    if (status === 'cancelled') {
      await Promise.all(order.items.map(i =>
        findByIdAndUpdate(i.product, { $inc: { stock: i.quantity, sold: -i.quantity } })
      ));
    }

    await sendOrderStatusEmail(order.customer, order).catch(() => null);

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

// ── POST /orders/stripe-intent ────────────────────────────
export async function createStripeIntent(req, res, next) {
  try {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || amount < 50) return next(new AppError('Amount must be at least $0.50.', 400));

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: { userId: String(req.user._id) },
    });

    res.json({ success: true, clientSecret: intent.client_secret });
  } catch (err) { next(err); }
}
