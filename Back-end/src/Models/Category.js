import { db } from '../configs/db.js';
import { Categories } from './schema.js';
import { eq, and, isNull } from 'drizzle-orm';
import slugify from 'slugify';

// Category Queries
export async function findCategories(filter = {}) {
  let query = db.select().from(Categories);

  const conditions = [];
  if (filter.isActive !== undefined) conditions.push(eq(Categories.isActive, filter.isActive));
  if (filter.parentId) conditions.push(eq(Categories.parentId, filter.parentId));
  if (conditions.length) query = query.where(and(...conditions));

  return await query;
}

export async function findCategoryById(id) {
  const [result] = await db.select().from(Categories).where(eq(Categories.id, id));
  return result || null;
}

export async function findCategoryBySlug(slug) {
  const [result] = await db.select().from(Categories).where(eq(Categories.slug, slug));
  return result || null;
}

export async function findCategoryByName(name) {
  const [result] = await db.select().from(Categories).where(eq(Categories.name, name));
  return result || null;
}

// Category Management
export async function createCategory(data) {
  const slug = slugify(data.name, { lower: true, strict: true });

  const [result] = await db.insert(Categories).values({
    ...data,
    slug,
  }).returning();
  return result;
}

export async function updateCategory(id, updateData) {
  if (updateData.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  }
  updateData.updatedAt = new Date();

  const [result] = await db.update(Categories).set(updateData).where(eq(Categories.id, id)).returning();
  return result;
}

export async function deleteCategory(id) {
  return await db.delete(Categories).where(eq(Categories.id, id));
}

// Root categories (those without parent)
export async function getRootCategories() {
  return await db.select().from(Categories).where(
    and(isNull(Categories.parentId), eq(Categories.isActive, true))
  );
}

// Subcategories
export async function getSubcategories(parentId) {
  return await db.select().from(Categories).where(
    and(eq(Categories.parentId, parentId), eq(Categories.isActive, true))
  );
}

// Get category with hierarchy
export async function getCategoryHierarchy(parentId = null) {
  const parent = parentId ? await findCategoryById(parentId) : null;
  const subcats = await getSubcategories(parentId || '');
  return {
    parent,
    subcategories: subcats,
  };
}
