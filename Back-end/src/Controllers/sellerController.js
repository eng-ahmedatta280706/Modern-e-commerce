import { findProducts } from '../Models/Product.js';
import { getSellerOrders, getOrderItems } from '../Models/Order.js';
import { getUserNotifications, markNotificationAsRead, markAllAsRead, getUnreadCount } from '../Models/Notification.js';
import { AppError } from '../Middleware/errorHandler.js';

// ═══════════════════════════════════════════════════════════
// SELLER DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export async function getSellerDashboard(req, res, next) {
  try {
    const sellerId = req.user.id;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch all data
    const allProducts = await findProducts({ sellerId });
    const totalProducts = allProducts.length;
    const activeProducts = allProducts.filter(p => p.isActive).length;
    const lowStockProducts = allProducts.filter(p => p.isActive && p.stock <= 5).length;

    // Only orders that contain this seller's items (joined via order_items).
    const allOrders = await getSellerOrders(sellerId);
    const totalOrders = allOrders.length;

    const thisMonthOrderDocs = allOrders.filter(o => new Date(o.createdAt) >= start);
    const lastMonthOrderDocs = allOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= last && d < start;
    });

    const ordersByStatus = {};
    allOrders.forEach(o => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    const topProducts = allProducts
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const monthlySales = {};
    allOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlySales[key]) monthlySales[key] = { revenue: 0, orders: 0 };
      monthlySales[key].revenue += Number(o.total);
      monthlySales[key].orders += 1;
    });

    const unreadNotifications = await getUnreadCount(sellerId);

    const calcRevenue = (orders) => orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const thisRevenue = calcRevenue(thisMonthOrderDocs);
    const lastRevenue = calcRevenue(lastMonthOrderDocs);
    const commission = req.user.commissionRate;
    const netRevenue = +((thisRevenue * (1 - commission / 100))).toFixed(2);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          lowStockProducts,
          totalOrders,
          thisMonthOrders: thisMonthOrderDocs.length,
          thisMonthRevenue: +thisRevenue.toFixed(2),
          netRevenue,
          commission,
          lastMonthRevenue: +lastRevenue.toFixed(2),
          revenueGrowth: lastRevenue === 0 ? 100
            : +(((thisRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1),
          unreadNotifications,
        },
        ordersByStatus,
        topProducts,
        recentOrders,
        monthlySales: Object.entries(monthlySales)
          .sort()
          .slice(-12)
          .map(([month, data]) => ({
            month,
            revenue: +data.revenue.toFixed(2),
            orders: data.orders,
          })),
      },
    });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// SELLER PRODUCTS
// ═══════════════════════════════════════════════════════════

export async function getMyProducts(req, res, next) {
  try {
    const { page = 1, limit = 20, search, category, badge, status } = req.query;
    const allProducts = await findProducts({ sellerId: req.user.id });

    let filtered = allProducts;
    if (category) filtered = filtered.filter(p => String(p.categoryId) === String(category));
    if (badge) filtered = filtered.filter(p => p.badge === badge);
    if (status === 'active') filtered = filtered.filter(p => p.isActive);
    if (status === 'inactive') filtered = filtered.filter(p => !p.isActive);
    if (search) filtered = filtered.filter(p => new RegExp(search, 'i').test(p.name));

    const total = filtered.length;
    const products = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// SELLER ORDERS
// ═══════════════════════════════════════════════════════════

export async function getMyOrders(req, res, next) {
  try {
    const sellerId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;
    const allOrders = await getSellerOrders(sellerId);

    let filtered = allOrders;
    if (status) filtered = filtered.filter(o => o.status === status);

    const total = filtered.length;
    const orders = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    // Attach only this seller's line items to each order (items live in a separate table).
    const filtered_orders = await Promise.all(orders.map(async (o) => {
      const items = await getOrderItems(o.id);
      const myItems = items.filter(i => String(i.sellerId) === String(sellerId));
      return {
        ...o,
        items: myItems,
        sellerSubtotal: myItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
      };
    }));

    res.json({ success: true, data: filtered_orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export async function getMyNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const allNotifications = await getUserNotifications(req.user.id, 1000);
    const total = allNotifications.length;
    const unread = (await getUnreadCount(req.user.id));

    const notifications = allNotifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: notifications, unread, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await markAllAsRead(req.user.id);
    } else {
      await markNotificationAsRead(id);
    }
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// STORE PROFILE
// ═══════════════════════════════════════════════════════════

export async function getStoreProfile(req, res, next) {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) { next(err); }
}
