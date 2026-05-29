import { create } from '../models/Notification';

const createNotification = async ({ recipient, type, title, message, link = '', data = {} }) => {
  try {
    return await create({ recipient, type, title, message, link, data });
  } catch (err) {
    console.error('Notification create error:', err.message);
  }
};

// ── Shortcut builders ────────────────────────────────────

export function notifyNewOrder(adminId, order)  {   return createNotification({
    recipient: adminId,
    type: 'new_order',
    title: 'New Order Received',
    message: `Order #${order._id} for $${order.total.toFixed(2)} was placed.`,
    link: `/admin/orders/${order._id}`,
    data: { orderId: order._id },
  });   }

export function notifySellerNewOrder(sellerId, order, items)  {   return createNotification({
    recipient: sellerId,
    type: 'new_order',
    title: 'You have a new order!',
    message: `${items.length} item(s) from your store in order #${order._id}.`,
    link: `/seller/orders/${order._id}`,
    data: { orderId: order._id },
  });   }

export function notifyNewSeller(adminId, seller)  {   return createNotification({
    recipient: adminId,
    type: 'new_seller',
    title: 'New Seller Application',
    message: `${seller.name} applied to become a seller: "${seller.storeName}".`,
    link: `/admin/sellers/${seller._id}`,
    data: { sellerId: seller._id },
  });   }

export function notifySellerApproved(sellerId)  {   return createNotification({
    recipient: sellerId,
    type: 'seller_approved',
    title: 'Your store is approved!',
    message: 'Your seller account has been approved. Start listing products now.',
    link: '/seller/dashboard',
  });   }

export function notifySellerRejected(sellerId)  {   return createNotification({
    recipient: sellerId,
    type: 'seller_rejected',
    title: 'Seller application rejected',
    message: 'Your seller application was not approved. Check your email for details.',
    link: '/seller/apply',
  });   }

export function notifyLowStock(sellerId, product)  {   return createNotification({
    recipient: sellerId,
    type: 'low_stock',
    title: 'Low stock alert',
    message: `"${product.name}" has only ${product.stock} units left.`,
    link: `/seller/products/${product._id}`,
    data: { productId: product._id, stock: product.stock },
  });   }

export function notifyNewReview(sellerId, product, review)  {   return createNotification({
    recipient: sellerId,
    type: 'new_review',
    title: 'New Review',
    message: `${review.name} left a ${review.rating}★ review on "${product.name}".`,
    link: `/seller/products/${product._id}`,
    data: { productId: product._id },
  });   }

const _createNotification = createNotification;
export { _createNotification as createNotification };
