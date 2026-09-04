import { db } from '../configs/db.js';
import { Orders, OrderItems } from './schema.js';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { findProductById, decreaseStock, restoreStock } from './Product.js';
import { findCouponOne, incrementCouponUsage } from './Coupon.js';

// Sale price defaults to '0' (a truthy string), so only use it when it is a real, positive value.
const effectiveUnitPrice = (product) => {
  const sale = Number(product.salePrice);
  return sale > 0 ? sale : Number(product.price);
};

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
export const PAYMENT_METHODS = ['card', 'paypal', 'cod', 'stripe'];
export const SHIPPING_METHODS = ['standard', 'express', 'pickup'];
export const TAX_RATE = 0.10;
export const SHIPPING_COSTS = { standard: 5, express: 15, pickup: 0 };
export const MAX_DISCOUNT = 100;
export const MAX_DISCOUNT_PERCENTAGE = 50;
export const MAX_COUPON_DISCOUNT = 50;
export const MAX_COUPON_DISCOUNT_PERCENTAGE = 30;
export const MAX_SHIPPING_DISCOUNT = 15;
export const MAX_ORDER_TOTAL = 10000;
export const MIN_ORDER_TOTAL = 1;
export const MAX_ORDER_QUANTITY = 100;
export const MAX_ORDER_ITEMS = 20;
export const MAX_COUPON_USAGE = 1000;

// Order Creation
export async function createOrder(orderData) {
  const { items, shippingAddress, shippingMethod, paymentMethod, couponCode, notes, customerId } = orderData;

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  // Validate items and calculate subtotal
  let subtotal = 0;
  for (const item of items) {
    const product = await findProductById(item.product);
    if (!product) {
      throw new Error(`Product not available: ${item.product}`);
    }
    if (!product.isActive) {
      throw new Error(`Product not active: ${product.name}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for: ${product.name}`);
    }
    subtotal += parseFloat((effectiveUnitPrice(product) * item.quantity).toFixed(2));
  }

  const shippingCost = SHIPPING_COSTS[shippingMethod] || SHIPPING_COSTS.standard;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));

  // Calculate discount from coupon
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await findCouponOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      throw new Error('Invalid or expired coupon code.');
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new Error('This coupon has expired.');
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('This coupon has reached its usage limit.');
    }
    appliedCoupon = coupon;
    if (subtotal < Number(coupon.minOrder)) {
      throw new Error(`Minimum order of $${coupon.minOrder} required for this coupon.`);
    }
    if (coupon.type === 'percentage') {
      discount = Math.min(
        subtotal * Number(coupon.value) / 100,
        MAX_COUPON_DISCOUNT_PERCENTAGE * subtotal / 100
      );
    } else if (coupon.type === 'fixed') {
      discount = Math.min(Number(coupon.value), MAX_COUPON_DISCOUNT);
    } else if (coupon.type === 'shipping') {
      discount = Math.min(shippingCost, MAX_SHIPPING_DISCOUNT);
    }
    discount = parseFloat(discount.toFixed(2));
  }

  const total = parseFloat((subtotal + shippingCost + tax - discount).toFixed(2));

  if (total < MIN_ORDER_TOTAL || total > MAX_ORDER_TOTAL) {
    throw new Error(`Order total must be between $${MIN_ORDER_TOTAL} and $${MAX_ORDER_TOTAL}.`);
  }

  // Create order
  const [order] = await db.insert(Orders).values({
    customerId,
    shippingAddress,
    shippingMethod,
    shippingCost: shippingCost.toString(),
    paymentMethod,
    subtotal: subtotal.toString(),
    tax: tax.toString(),
    discount: discount.toString(),
    total: total.toString(),
    couponCode,
    notes,
  }).returning();

  // Create order items
  for (const item of items) {
    const product = await findProductById(item.product);
    const itemName = product ? (product.name || '') : '';
    const itemImage = product && Array.isArray(product.images) && product.images.length ? product.images[0] : '';
    const itemPrice = product ? effectiveUnitPrice(product) : 0;
    await db.insert(OrderItems).values({
      orderId: order.id,
      productId: item.product,
      sellerId: item.seller,
      name: itemName,
      image: itemImage,
      price: itemPrice.toString(),
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });

    // Decrease stock
    await decreaseStock(item.product, item.quantity);
  }

  // Record coupon usage so usage limits are actually enforced.
  if (appliedCoupon) {
    await incrementCouponUsage(appliedCoupon.id);
  }

  return order;
}

// Order Queries
export async function findOrders(filter = {}, options = {}) {
  let query = db.select().from(Orders);

  const conditions = [];
  if (filter.customerId) conditions.push(eq(Orders.customerId, filter.customerId));
  if (filter.status) conditions.push(eq(Orders.status, filter.status));
  if (conditions.length) query = query.where(and(...conditions));

  if (options.sort) {
    query = query.orderBy(desc(Orders.createdAt));
  }

  return await query;
}

export async function findOrderById(id) {
  const [result] = await db.select().from(Orders).where(eq(Orders.id, id));
  return result || null;
}

export async function countOrders(filter = {}) {
  const results = await findOrders(filter);
  return results.length;
}

// Order Updates
export async function updateOrder(id, updateData) {
  const order = await findOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  updateData.updatedAt = new Date();
  const [result] = await db.update(Orders).set(updateData).where(eq(Orders.id, id)).returning();
  return result;
}

export async function deleteOrder(id) {
  return await db.delete(Orders).where(eq(Orders.id, id));
}

// Order Status Management
export async function markOrderPaid(id, paymentIntentId = null) {
  const updates = {
    paymentStatus: 'paid',
    updatedAt: new Date(),
  };
  if (paymentIntentId) {
    updates.stripePaymentIntentId = paymentIntentId;
  }
  return await updateOrder(id, updates);
}

export async function cancelOrder(id) {
  const order = await findOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }

  // Restore stock for all items
  const items = await db.select().from(OrderItems).where(eq(OrderItems.orderId, id));
  for (const item of items) {
    await restoreStock(item.productId, item.quantity);
  }

  return await updateOrder(id, {
    status: 'cancelled',
    cancelledAt: new Date(),
  });
}

// Get Order Items
export async function getOrderItems(orderId) {
  return await db.select().from(OrderItems).where(eq(OrderItems.orderId, orderId));
}

export async function getItemCount(orderId) {
  const items = await getOrderItems(orderId);
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// Analytics
export async function getTotalRevenue() {
  const paidOrders = await db.select().from(Orders).where(eq(Orders.paymentStatus, 'paid'));
  return paidOrders.reduce((sum, order) => sum + Number(order.total), 0);
}

export async function getOrdersByStatus(status) {
  return await db.select().from(Orders).where(eq(Orders.status, status));
}

export async function getOrdersByCustomer(customerId) {
  return await db.select().from(Orders).where(eq(Orders.customerId, customerId)).orderBy(desc(Orders.createdAt));
}

export async function getSellerOrders(sellerId) {
  const sellerOrderItems = await db.select().from(OrderItems).where(eq(OrderItems.sellerId, sellerId));
  const orderIds = [...new Set(sellerOrderItems.map(item => item.orderId))];
  if (orderIds.length === 0) {
    return [];
  }
  return await db.select().from(Orders).where(inArray(Orders.id, orderIds));
}

export async function aggregate(orderId) {
  const items = await getOrderItems(orderId);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalRevenue = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  return { totalQuantity, totalRevenue };
}