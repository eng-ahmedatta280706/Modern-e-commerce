import Stripe from 'stripe';
import { createOrder, findOrders, findOrderById, updateOrder, cancelOrder } from '../Models/Order.js';
import { findUser, findUserById } from '../Models/User.js';
import errorHandlerModule from '../Middleware/errorHandler.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../Services/emailService.js';
import { notifyNewOrder, notifySellerNewOrder } from '../Services/notificationService.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const { AppError } = errorHandlerModule;

const SHIPPING_COSTS = { standard: 5, express: 15, pickup: 0 };
const TAX_RATE = 0.10;

// ── POST /orders ─────────────────────────────────────────
export async function createOrderHandler(req, res, next) {
  try {
    const { items, shippingAddress, shippingMethod = 'standard', paymentMethod, couponCode, notes } = req.body;

    if (!items?.length) return next(new AppError('Order must contain items.', 400));

    // Use Order Model helper to create order with validation
    try {
      const order = await createOrder({
        items,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        couponCode,
        notes,
        customerId: req.user.id,
      });

      // Notify admins + sellers
      const admins = await findUser({ role: 'admin' });
      await Promise.all(admins.map(a => notifyNewOrder(a.id, order)));

      const sellerMap = {};
      const orderItems = items.map(item => ({
        ...item,
        seller: item.seller,
      }));
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

      const user = await findUserById(req.user.id);
      await sendOrderConfirmationEmail(user, order).catch(() => null);

      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  } catch (err) { next(err); }
}

// ── GET /orders (customer: own orders) ───────────────────
export async function getMyOrders(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const filter = { customerId: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const results = await findOrders(filter);
    const total = results.length;
    const orders = results.slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: orders, pagination: { page, limit, total } });
  } catch (err) { next(err); }
}

// ── GET /orders/:id ───────────────────────────────────────
export async function getOrder(req, res, next) {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) return next(new AppError('Order not found.', 404));

    // Customers can only see their own
    if (req.user.role === 'customer' && String(order.customerId) !== String(req.user.id)) {
      return next(new AppError('Not authorized.', 403));
    }
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

// ── PATCH /orders/:id/status (admin / seller) ────────────
export async function updateOrderStatus(req, res, next) {
  try {
    const { status, trackingNumber } = req.body;
    const order = await findOrderById(req.params.id);
    if (!order) return next(new AppError('Order not found.', 404));

    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return next(new AppError(`Cannot move from ${order.status} to ${status}.`, 400));
    }

    let updated;
    if (status === 'cancelled') {
      // cancelOrder restores stock for every line item, then flips the status.
      updated = await cancelOrder(req.params.id);
      if (trackingNumber) {
        updated = await updateOrder(req.params.id, { trackingNumber });
      }
    } else {
      const updateData = { status };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (status === 'delivered') updateData.deliveredAt = new Date();
      updated = await updateOrder(req.params.id, updateData);
    }

    const customer = await findUserById(order.customerId);
    await sendOrderStatusEmail(customer, updated).catch(() => null);

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// ── POST /orders/stripe-intent ────────────────────────────
export async function createStripeIntent(req, res, next) {
  try {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || amount < 50) return next(new AppError('Amount must be at least $0.50.', 400));
    if (!stripe) return next(new AppError('Stripe is not configured on this server.', 503));

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: { userId: String(req.user.id) },
    });

    res.json({ success: true, clientSecret: intent.client_secret });
  } catch (err) { next(err); }
}
