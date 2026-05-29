import { countDocuments, find, findById, findByIdAndUpdate, findOneAndUpdate } from '../models/User';
import { countDocuments as _countDocuments, find as _find, findById as _findById } from '../models/Product';
import { countDocuments as __countDocuments, find as __find, aggregate } from '../models/Order';
import { find as ___find, create, findByIdAndUpdate as _findByIdAndUpdate, findByIdAndDelete } from '../models/Coupon';
import { AppError } from '../middleware/errorHandler';
import { sendSellerApprovalEmail, sendSellerRejectionEmail } from '../services/emailService';
import { notifySellerApproved, notifySellerRejected } from '../services/notificationService';

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export async function getDashboardStats(_req, res, next) {
  try {
    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // start of this month
    const last  = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers, totalSellers, totalProducts, totalOrders,
      thisMonthOrders, lastMonthOrders,
      pendingSellers,
      revenueData,
      ordersByStatus,
      topProducts,
      recentOrders,
      monthlySales,
    ] = await Promise.all([
      countDocuments({ role: 'customer' }),
      countDocuments({ role: 'seller' }),
      _countDocuments({ isActive: true }),
      __countDocuments(),

      __find({ createdAt: { $gte: start } }),
      __find({ createdAt: { $gte: last, $lt: start } }),

      countDocuments({ role: 'seller', sellerStatus: 'pending' }),

      aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      _find({ isActive: true }).sort({ sold: -1 }).limit(5)
        .populate('seller', 'name storeName'),

      __find().sort({ createdAt: -1 }).limit(10)
        .populate('customer', 'name email')
        .populate('items.product', 'name images'),

      aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    const thisRevenue = thisMonthOrders.reduce((s, o) => s + (o.total || 0), 0);
    const lastRevenue = lastMonthOrders.reduce((s, o) => s + (o.total || 0), 0);
    const revenueGrowth = lastRevenue === 0 ? 100
      : +(((thisRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSellers,
          totalProducts,
          totalOrders,
          totalRevenue: revenueData[0]?.total ?? 0,
          pendingSellers,
          thisMonthOrders: thisMonthOrders.length,
          thisMonthRevenue: +thisRevenue.toFixed(2),
          revenueGrowth,
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
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════

export async function getUsers(req, res, next) {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role)   filter.role  = role;
    if (search) filter.$or   = [
      { name:  new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const [users, total] = await Promise.all([
      find(filter).sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      countDocuments(filter),
    ]);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    const user = await findById(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const allowed = ['name', 'email', 'role', 'isActive', 'phone'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, message: 'User deactivated.' });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// SELLER MANAGEMENT
// ═══════════════════════════════════════════════════════════

export async function getSellers(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'seller' };
    if (status) filter.sellerStatus = status;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { storeName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const [sellers, total] = await Promise.all([
      find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      countDocuments(filter),
    ]);
    res.json({ success: true, data: sellers, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function approveSeller(req, res, next) {
  try {
    const seller = await findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { sellerStatus: 'approved' },
      { new: true }
    );
    if (!seller) return next(new AppError('Seller not found.', 404));

    await sendSellerApprovalEmail(seller).catch(() => null);
    await notifySellerApproved(seller._id).catch(() => null);

    res.json({ success: true, data: seller, message: 'Seller approved.' });
  } catch (err) { next(err); }
}

export async function rejectSeller(req, res, next) {
  try {
    const { reason } = req.body;
    const seller = await findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { sellerStatus: 'rejected' },
      { new: true }
    );
    if (!seller) return next(new AppError('Seller not found.', 404));

    await sendSellerRejectionEmail(seller, reason).catch(() => null);
    await notifySellerRejected(seller._id).catch(() => null);

    res.json({ success: true, data: seller, message: 'Seller rejected.' });
  } catch (err) { next(err); }
}

export async function suspendSeller(req, res, next) {
  try {
    const seller = await findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { sellerStatus: 'suspended', isActive: false },
      { new: true }
    );
    if (!seller) return next(new AppError('Seller not found.', 404));
    res.json({ success: true, data: seller, message: 'Seller suspended.' });
  } catch (err) { next(err); }
}

export async function updateSellerCommission(req, res, next) {
  try {
    const { commissionRate } = req.body;
    if (commissionRate < 0 || commissionRate > 100)
      return next(new AppError('Commission must be between 0 and 100.', 400));

    const seller = await findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { commissionRate },
      { new: true }
    );
    if (!seller) return next(new AppError('Seller not found.', 404));
    res.json({ success: true, data: seller });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// ORDER MANAGEMENT (admin view)
// ═══════════════════════════════════════════════════════════

export async function getAllOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to);
    }

    const [orders, total] = await Promise.all([
      __find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
        .populate('customer', 'name email')
        .populate('items.product', 'name images'),
      __countDocuments(filter),
    ]);
    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT (admin)
// ═══════════════════════════════════════════════════════════

export async function getAllProducts(req, res, next) {
  try {
    const { page = 1, limit = 20, search, category, seller } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (seller)   filter.seller   = seller;
    if (search)   filter.$text    = { $search: search };

    const [products, total] = await Promise.all([
      _find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
        .populate('seller', 'name storeName'),
      _countDocuments(filter),
    ]);
    res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function toggleProductFeatured(req, res, next) {
  try {
    const product = await _findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// COUPON MANAGEMENT
// ═══════════════════════════════════════════════════════════

export async function getCoupons(_req, res, next) {
  try {
    const coupons = await ___find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
}

export async function createCoupon(req, res, next) {
  try {
    const coupon = await create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
}

export async function updateCoupon(req, res, next) {
  try {
    const coupon = await _findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return next(new AppError('Coupon not found.', 404));
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
}

export async function deleteCoupon(req, res, next) {
  try {
    await findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) { next(err); }
}
