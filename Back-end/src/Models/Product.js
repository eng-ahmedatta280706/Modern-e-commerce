import { db } from '../configs/db.js';
import { Products, Reviews } from './schema.js';
import { eq, and, ilike, desc } from 'drizzle-orm';
import slugify from 'slugify';

// Product Queries
export async function findProducts(filter = {}) {
  let query = db.select().from(Products);

  if (filter.category) {
    query = query.where(eq(Products.categoryId, filter.category));
  }
  if (filter.sellerId) {
    query = query.where(eq(Products.sellerId, filter.sellerId));
  }
  if (filter.name) {
    query = query.where(ilike(Products.name, `%${filter.name}%`));
  }

  return await query;
}

export async function findProductOne(filter = {}) {
  const results = await findProducts(filter);
  return results[0] || null;
}

export async function findProductById(id) {
  const [result] = await db.select().from(Products).where(eq(Products.id, id));
  return result || null;
}

export async function createProduct(data) {
  const slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now();
  const salePrice = data.discount > 0
    ? parseFloat((data.price * (1 - data.discount / 100)).toFixed(2))
    : data.price;

  const [result] = await db.insert(Products).values({
    ...data,
    slug,
    salePrice,
  }).returning();
  return result;
}

export async function updateProductById(id, updateData) {
  if (updateData.name && updateData.name !== (await findProductById(id))?.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true }) + '-' + Date.now();
  }

  if (updateData.discount !== undefined && updateData.price) {
    updateData.salePrice = updateData.discount > 0
      ? parseFloat((updateData.price * (1 - updateData.discount / 100)).toFixed(2))
      : updateData.price;
  }

  updateData.updatedAt = new Date();
  const [result] = await db.update(Products).set(updateData).where(eq(Products.id, id)).returning();
  return result;
}

export async function countProducts(filter = {}) {
  const results = await findProducts(filter);
  return results.length;
}

// Review Operations
export async function addReview(productId, reviewData) {
  const [review] = await db.insert(Reviews).values({
    productId,
    userId: reviewData.user,
    name: reviewData.name,
    rating: reviewData.rating,
    comment: reviewData.comment,
  }).returning();

  await updateProductRating(productId);
  return review;
}

export async function getProductReviews(productId) {
  return await db.select().from(Reviews).where(eq(Reviews.productId, productId));
}

export async function updateProductRating(productId) {
  const allReviews = await getProductReviews(productId);

  let newRating = 0;
  let numReviews = 0;

  if (allReviews.length > 0) {
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    newRating = parseFloat((total / allReviews.length).toFixed(1));
    numReviews = allReviews.length;
  }

  await db.update(Products).set({
    rating: newRating,
    numReviews,
    updatedAt: new Date(),
  }).where(eq(Products.id, productId));
}

export async function deleteReviewById(reviewId) {
  const [review] = await db.select().from(Reviews).where(eq(Reviews.id, reviewId));
  if (!review) throw new Error('Review not found');

  await db.delete(Reviews).where(eq(Reviews.id, reviewId));
  await updateProductRating(review.productId);
  return true;
}

// Stock Operations
export async function decreaseStock(productId, qty) {
  const product = await findProductById(productId);
  if (!product) throw new Error('Product not found');

  const newStock = Math.max(0, product.stock - qty);
  const newSold = product.sold + qty;

  await db.update(Products).set({
    stock: newStock,
    sold: newSold,
    updatedAt: new Date(),
  }).where(eq(Products.id, productId));
}

export async function restoreStock(productId, qty) {
  const product = await findProductById(productId);
  if (!product) throw new Error('Product not found');

  const newStock = product.stock + qty;
  const newSold = Math.max(0, product.sold - qty);

  await db.update(Products).set({
    stock: newStock,
    sold: newSold,
    updatedAt: new Date(),
  }).where(eq(Products.id, productId));
}

// Search and Filter
export async function searchProducts(searchTerm) {
  return await db.select().from(Products).where(
    ilike(Products.name, `%${searchTerm}%`)
  );
}

export async function getFeaturedProducts() {
  return await db.select().from(Products).where(
    and(eq(Products.isFeatured, true), eq(Products.isActive, true))
  );
}

export async function getTopRatedProducts(limit = 10) {
  return await db.select().from(Products)
    .where(eq(Products.isActive, true))
    .orderBy(desc(Products.rating))
    .limit(limit);
}

export async function getBestSellingProducts(limit = 10) {
  return await db.select().from(Products)
    .where(eq(Products.isActive, true))
    .orderBy(desc(Products.sold))
    .limit(limit);
}
