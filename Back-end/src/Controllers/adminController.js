import { countUsers, findUser, findUserById, findUserByIdAndUpdate } from '../Models/User.js';
import { findProducts, countProducts, findProductById, updateProductById } from '../Models/Product.js';
import { findOrders, countOrders, getTotalRevenue, getOrdersByStatus } from '../Models/Order.js';
import { findCoupons, createCoupon, updateCoupon, deleteCoupon } from '../Models/Coupon.js';
import { AppError } from '../Middleware/errorHandler.js';
import { sendSellerApprovalEmail, sendSellerRejectionEmail } from '../Services/emailService.js';
import { notifySellerApproved, notifySellerRejected } from '../Services/notificationService.js';

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export async function getDashboardStats(_req, res, next) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch data for stats
    const totalUsers = (await findUser({ role: 'customer' })).length;
    const totalSellers = (await findUser({ role: 'seller' })).length;
    const allProducts = await findProducts({ isActive: true });
    const totalProducts = allProducts.length;
    const allOrders = await findOrders({});
    const totalOrders = allOrders.length;

    const thisMonthOrders = allOrders.filter(o => new Date(o.createdAt) >= start);
    const lastMonthOrders = allOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= last && d < start;
    });

    // findUser only filters by a single field (role), so narrow by status in JS.
    const pendingSellers = (await findUser({ role: 'seller' }))
      .filter(s => s.sellerStatus === 'pending').length;
    const totalRevenue = await getTotalRevenue();

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

    // Monthly sales aggregation (JS-level)
    const monthlySales = {};
    allOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlySales[key]) monthlySales[key] = { revenue: 0, orders: 0 };
      monthlySales[key].revenue += Number(o.total);
      monthlySales[key].orders += 1;
    });

    const thisRevenue = thisMonthOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const lastRevenue = lastMonthOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
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
          totalRevenue,
          pendingSellers,
          thisMonthOrders: thisMonthOrders.length,
          thisMonthRevenue: +thisRevenue.toFixed(2),
          revenueGrowth,
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
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════

export async function getUsers(req, res, next) {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const allUsers = await findUser({});

    let filtered = allUsers;
    if (role) filtered = filtered.filter(u => u.role === role);
    if (search) {
      const regex = new RegExp(search, 'i');
      filtered = filtered.filter(u => regex.test(u.name) || regex.test(u.email));
    }

    const total = filtered.length;
    const users = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const allowed = ['name', 'email', 'role', 'isActive', 'phone'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await findUserByIdAndUpdate(req.params.id, updates);
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await findUserByIdAndUpdate(req.params.id, { isActive: false });
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
    const allSellers = (await findUser({ role: 'seller' })) || [];

    let filtered = allSellers;
    if (status) filtered = filtered.filter(s => s.sellerStatus === status);
    if (search) {
      const regex = new RegExp(search, 'i');
      filtered = filtered.filter(s => regex.test(s.name) || regex.test(s.storeName) || regex.test(s.email));
    }

    const total = filtered.length;
    const sellers = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: sellers, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function approveSeller(req, res, next) {
  try {
    const seller = await findUserByIdAndUpdate(req.params.id, { sellerStatus: 'approved' });
    if (!seller || seller.role !== 'seller') return next(new AppError('Seller not found.', 404));

    await sendSellerApprovalEmail(seller).catch(() => null);
    await notifySellerApproved(seller.id).catch(() => null);

    res.json({ success: true, data: seller, message: 'Seller approved.' });
  } catch (err) { next(err); }
}

export async function rejectSeller(req, res, next) {
  try {
    const { reason } = req.body;
    const seller = await findUserByIdAndUpdate(req.params.id, { sellerStatus: 'rejected' });
    if (!seller || seller.role !== 'seller') return next(new AppError('Seller not found.', 404));

    await sendSellerRejectionEmail(seller, reason).catch(() => null);
    await notifySellerRejected(seller.id).catch(() => null);

    res.json({ success: true, data: seller, message: 'Seller rejected.' });
  } catch (err) { next(err); }
}

export async function suspendSeller(req, res, next) {
  try {
    const seller = await findUserByIdAndUpdate(req.params.id, { sellerStatus: 'suspended', isActive: false });
    if (!seller) return next(new AppError('Seller not found.', 404));
    res.json({ success: true, data: seller, message: 'Seller suspended.' });
  } catch (err) { next(err); }
}

export async function updateSellerCommission(req, res, next) {
  try {
    const { commissionRate } = req.body;
    if (commissionRate < 0 || commissionRate > 100)
      return next(new AppError('Commission must be between 0 and 100.', 400));

    const seller = await findUserByIdAndUpdate(req.params.id, { commissionRate });
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
    const allOrders = await findOrders({});

    let filtered = allOrders;
    if (status) filtered = filtered.filter(o => o.status === status);
    if (from || to) {
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;
      filtered = filtered.filter(o => {
        const oDate = new Date(o.createdAt);
        if (fromDate && oDate < fromDate) return false;
        if (toDate && oDate > toDate) return false;
        return true;
      });
    }

    const total = filtered.length;
    const orders = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT (admin)
// ═══════════════════════════════════════════════════════════

export async function getAllProducts(req, res, next) {
  try {
    const { page = 1, limit = 20, search, category, seller } = req.query;
    const allProducts = await findProducts({});

    let filtered = allProducts;
    if (category) filtered = filtered.filter(p => String(p.categoryId) === String(category));
    if (seller) filtered = filtered.filter(p => String(p.sellerId) === String(seller));
    if (search) filtered = filtered.filter(p => new RegExp(search, 'i').test(p.name));

    const total = filtered.length;
    const products = filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
}

export async function toggleProductFeatured(req, res, next) {
  try {
    const product = await findProductById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    const updated = await updateProductById(req.params.id, { isFeatured: !product.isFeatured });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════
// COUPON MANAGEMENT
// ═══════════════════════════════════════════════════════════

export async function getCoupons(_req, res, next) {
  try {
    const coupons = await findCoupons({});
    const sorted = coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: sorted });
  } catch (err) { next(err); }
}

export async function create_Coupon(req, res, next) {
  try {
    const coupon = await createCoupon({ ...req.body, createdById: req.user.id });
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
}

export async function update_Coupon(req, res, next) {
  try {
    const coupon = await updateCoupon(req.params.id, req.body);
    if (!coupon) return next(new AppError('Coupon not found.', 404));
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
}

export async function delete_Coupon(req, res, next) {
  try {
    await deleteCoupon(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) { next(err); }
}
