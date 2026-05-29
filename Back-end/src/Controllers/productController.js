import { find, countDocuments, findOne, create, findById, findByIdAndUpdate } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { notifyLowStock, notifyNewReview } from '../services/notificationService';

// ── Helpers ───────────────────────────────────────────────
const buildQuery = (queryParams) => {
  const { category, subcategory, badge, minPrice, maxPrice,
          color, search, seller, featured } = queryParams;
  const filter = { isActive: true };

  if (category)    filter.category    = new RegExp(category, 'i');
  if (subcategory) filter.subcategory = new RegExp(subcategory, 'i');
  if (badge)       filter.badge       = badge;
  if (seller)      filter.seller      = seller;
  if (featured)    filter.isFeatured  = true;
  if (color)       filter.colors      = { $in: [color] };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  return filter;
};

// ── GET /products ─────────────────────────────────────────
export async function getProducts(req, res, next) {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(50, Number(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    const sortMap = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'newest':     { createdAt: -1 },
      'rating':     { rating: -1 },
      'name-asc':   { name: 1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const filter = buildQuery(req.query);
    const [products, total] = await Promise.all([
      find(filter).sort(sort).skip(skip).limit(limit)
        .populate('seller', 'name storeName storeLogo'),
      countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
}

// ── GET /products/:id ─────────────────────────────────────
export async function getProduct(req, res, next) {
  try {
    const product = await findOne({ _id: req.params.id, isActive: true })
      .populate('seller', 'name storeName storeLogo storeBio');
    if (!product) return next(new AppError('Product not found.', 404));
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ── POST /products (seller + admin) ───────────────────────
export async function createProduct(req, res, next) {
  try {
    const images = req.files?.map(f => f.path) ?? [];
    const product = await create({
      ...req.body,
      seller: req.user._id,
      images,
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ── PUT /products/:id ─────────────────────────────────────
export async function updateProduct(req, res, next) {
  try {
    const product = await findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    // Sellers can only edit their own products
    if (req.user.role === 'seller' && String(product.seller) !== String(req.user._id)) {
      return next(new AppError('You can only edit your own products.', 403));
    }

    const newImages = req.files?.map(f => f.path) ?? [];
    if (newImages.length) req.body.images = [...(product.images ?? []), ...newImages];

    const updated = await findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });

    // Low-stock alert (≤5 units)
    if (updated.stock <= 5) {
      await notifyLowStock(updated.seller, updated).catch(() => null);
    }

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// ── DELETE /products/:id ──────────────────────────────────
export async function deleteProduct(req, res, next) {
  try {
    const product = await findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    if (req.user.role === 'seller' && String(product.seller) !== String(req.user._id)) {
      return next(new AppError('You can only delete your own products.', 403));
    }

    // Soft delete
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product removed.' });
  } catch (err) { next(err); }
}

// ── POST /products/:id/reviews ────────────────────────────
export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    const alreadyReviewed = product.reviews.find(
      r => String(r.user) === String(req.user._id)
    );
    if (alreadyReviewed) return next(new AppError('You already reviewed this product.', 400));

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.updateRating();
    await product.save();

    await notifyNewReview(product.seller, product, review).catch(() => null);

    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

// ── DELETE /products/:id/reviews/:reviewId ────────────────
export async function deleteReview(req, res, next) {
  try {
    const product = await findById(req.params.id);
    if (!product) return next(new AppError('Product not found.', 404));

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return next(new AppError('Review not found.', 404));

    // Only reviewer or admin can delete
    if (String(review.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return next(new AppError('Not authorized.', 403));
    }

    review.deleteOne();
    product.updateRating();
    await product.save();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
}
