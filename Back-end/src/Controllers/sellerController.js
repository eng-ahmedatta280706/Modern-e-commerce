import { countDocuments, find } from '../models/Product';
import { countDocuments as _countDocuments, find as _find, aggregate } from '../models/Order';
import { countDocuments as __countDocuments, find as __find, updateMany, findOneAndUpdate } from '../models/Notification';
import { AppError } from '../middleware/errorHandler';

// ═══════════════════════════════════════════════════════════
// SELLER DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export async function getSellerDashboard(req, res, next) {
  try {
    const sellerId = req.user._id;
    const now      = new Date();
    const start    = new Date(now.getFullYear(), now.getMonth(), 1);
    const last     = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      thisMonthOrderDocs,
      lastMonthOrderDocs,
      ordersByStatus,
      topProducts,
      recentOrders,
      monthlySales,
      unreadNotifications,
    ] = await Promise.all([
      countDocuments({ seller: sellerId }),
      countDocuments({ seller: sellerId, isActive: true }),
      countDocuments({ seller: sellerId, isActive: true, stock: { $lte: 5 } }),
      _countDocuments({ 'items.seller': sellerId }),

      _find({ 'items.seller': sellerId, createdAt: { $gte: start } }),
      _find({ 'items.seller': sellerId, createdAt: { $gte: last, $lt: start } }),

      aggregate([
        { $match: { 'items.seller': sellerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      find({ seller: sellerId, isActive: true })
        .sort({ sold: -1 }).limit(5),

      _find({ 'items.seller': sellerId }).sort({ createdAt: -1 }).limit(10)
        .populate('customer', 'name email')
        .populate('items.product', 'name images'),

      aggregate([
        { $match: { 'items.seller': sellerId, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        { $match: { 'items.seller': sellerId } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),

      __countDocuments({ recipient: sellerId, isRead: false }),
    ]);

    // Revenue helpers
    const calcRevenue = (orders) => orders.reduce((s, o) => {
      const myItems = o.items.filter(i => String(i.seller) === String(sellerId));
      return s + myItems.reduce((ss, i) => ss + i.price * i.quantity, 0);
    }, 0);

    const thisRevenue = calcRevenue(thisMonthOrderDocs);
    const lastRevenue = calcRevenue(lastMonthOrderDocs);
    const commission  = req.user.commissionRate;
    const netRevenue  = +((thisRevenue * (1 - commission / 100))).toFixed(2);

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
        ordersByStatus: Object.fromEntries(ordersByStatus.map(s => [s._id, s.count])),
        topProducts,
        recentOrders,
        monthlySales: monthlySales.map(m => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          revenue: +m.revenue.toFixed(2),
          orders: m.orders,
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
    const filter = { seller: req.user._id };
    if (category) filter.category = new RegExp(category, 'i');
    if (badge)    filter.badge    = badge;
    if (status === 'active')   filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search)   filter.$text   = { $search: search };

    const [products, total] = await Promise.all([
      find(filter).sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      countDocuments(filter),
    ]);
    res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// SELLER ORDERS
// ═══════════════════════════════════════════════════════════

export async function getMyOrders(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { 'items.seller': req.user._id };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      _find(filter).sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit))
        .populate('customer', 'name email phone')
        .populate('items.product', 'name images'),
      _countDocuments(filter),
    ]);

    // Expose only this seller's items per order
    const filtered = orders.map(o => {
      const obj = o.toObject();
      obj.items = obj.items.filter(i => String(i.seller) === String(req.user._id));
      obj.sellerSubtotal = obj.items.reduce((s, i) => s + i.price * i.quantity, 0);
      return obj;
    });

    res.json({ success: true, data: filtered, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export async function getMyNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [notifications, total, unread] = await Promise.all([
      __find({ recipient: req.user._id })
        .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      __countDocuments({ recipient: req.user._id }),
      __countDocuments({ recipient: req.user._id, isRead: false }),
    ]);
    res.json({ success: true, data: notifications, unread, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await updateMany({ recipient: req.user._id }, { isRead: true });
    } else {
      await findOneAndUpdate({ _id: id, recipient: req.user._id }, { isRead: true });
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
