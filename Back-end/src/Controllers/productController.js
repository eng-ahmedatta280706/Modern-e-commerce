import { findProducts, findProductById, createProduct, updateProductById, countProducts, addReview, deleteReviewById, getProductReviews } from '../Models/Product.js';
import { AppError } from '../Middleware/errorHandler.js';
import { notifyLowStock, notifyNewReview } from '../Services/notificationService.js';

// Effective (sale-aware) price. salePrice defaults to '0', so only use it when > 0.
const effectivePrice = (p) => {
  const sale = Number(p.salePrice);
  return sale > 0 ? sale : Number(p.price);
};

// Numeric columns come back from Postgres as strings, so sort/compare accordingly.
const NUMERIC_KEYS = new Set(['price', 'rating', 'sold', 'stock']);

// ── GET /products ─────────────────────────────────────────
export async function getProducts(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const { category, subcategory, badge, minPrice, maxPrice, color, search, seller, featured } = req.query;

    // Fetch all, then filter in JS (the Drizzle model only understands a few keys).
    let results = await findProducts({});
    results = results.filter((p) => p.isActive);

    if (category) results = results.filter((p) => String(p.categoryId) === String(category));
    if (subcategory) results = results.filter((p) => String(p.subcategoryId) === String(subcategory));
    if (badge) results = results.filter((p) => p.badge === badge);
    if (seller) results = results.filter((p) => String(p.sellerId) === String(seller));
    if (featured) results = results.filter((p) => p.isFeatured);
    if (color) results = results.filter((p) => Array.isArray(p.colors) && p.colors.includes(color));
    if (minPrice) results = results.filter((p) => effectivePrice(p) >= Number(minPrice));
    if (maxPrice) results = results.filter((p) => effectivePrice(p) <= Number(maxPrice));
    if (search) {
      const re = new RegExp(search, 'i');
      results = results.filter((p) => re.test(p.name || '') || re.test(p.description || ''));
    }

    const sortMap = {
      'price-asc': { key: 'price', dir: 1 },
      'price-desc': { key: 'price', dir: -1 },
      'newest': { key: 'createdAt', dir: -1 },
      'rating': { key: 'rating', dir: -1 },
      'name-asc': { key: 'name', dir: 1 },
    };
    const sort = sortMap[req.query.sort] || { key: 'createdAt', dir: -1 };

    results.sort((a, b) => {
      let va = a[sort.key];
      let vb = b[sort.key];
      if (NUMERIC_KEYS.has(sort.key)) { va = Number(va); vb = Number(vb); }
      if (va == null) return 1 * sort.dir;
      if (vb == null) return -1 * sort.dir;
      if (va < vb) return -1 * sort.dir;
      if (va > vb) return 1 * sort.dir;
      return 0;
    });

    const total = results.length;
    const products = results.slice(skip, skip + limit);

    res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

// ── GET /products/:id ─────────────────────────────────────
export async function getProduct(req, res, next) {
  try {
    const product = await findProductById(req.params.id);
    if (!product || !product.isActive) return next(new AppError('Product not found.', 404));
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ── POST /products (seller + admin) ───────────────────────
export async function create_Product(req, res, next) {
  try {
    const images = req.files?.map(f => f.path) ?? [];
    const product = await createProduct({
      ...req.body,
      sellerId: req.user.id,
      images,
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ── PUT /products/:id ─────────────────────────────────────
export async function updateProduct(req, res, next) {
  try {
    const product = await findProductById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    // Sellers can only edit their own products
    if (req.user.role === 'seller' && String(product.sellerId) !== String(req.user.id)) {
      return next(new AppError('You can only edit your own products.', 403));
    }

    const newImages = req.files?.map(f => f.path) ?? [];
    if (newImages.length) req.body.images = [...(product.images ?? []), ...newImages];

    const updated = await updateProductById(req.params.id, req.body);

    // Low-stock alert (≤5 units)
    if (updated.stock <= 5) {
      await notifyLowStock(updated.sellerId, updated).catch(() => null);
    }

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// ── DELETE /products/:id ──────────────────────────────────
export async function deleteProduct(req, res, next) {
  try {
    const product = await findProductById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    if (req.user.role === 'seller' && String(product.sellerId) !== String(req.user.id)) {
      return next(new AppError('You can only delete your own products.', 403));
    }

    // Soft delete via update helper
    await updateProductById(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed.' });
  } catch (err) { next(err); }
}

// ── POST /products/:id/reviews ────────────────────────────
export async function add_Review(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await findProductById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    const existingReviews = await getProductReviews(req.params.id);
    const alreadyReviewed = existingReviews.find(r => String(r.userId) === String(req.user.id));
    if (alreadyReviewed) return next(new AppError('You already reviewed this product.', 400));

    const reviewData = { user: req.user.id, name: req.user.name, rating: Number(rating), comment };
    await addReview(req.params.id, reviewData);

    const updatedProduct = await findProductById(req.params.id);
    await notifyNewReview(updatedProduct.sellerId, updatedProduct, reviewData).catch(() => null);

    res.status(201).json({ success: true, data: updatedProduct });
  } catch (err) { next(err); }
}

// ── DELETE /products/:id/reviews/:reviewId ────────────────
export async function deleteReview(req, res, next) {
  try {
    // Delete review via model helper
    await deleteReviewById(req.params.reviewId);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
}
