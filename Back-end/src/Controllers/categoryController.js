import { findCategories, findCategoryBySlug, createCategory, updateCategory } from '../Models/Category.js';
import { AppError } from '../Middleware/errorHandler.js';

export async function getCategories(_req, res, next) {
  try {
    const categories = await findCategories({ isActive: true });
    // JS-level sort by order and name
    const sorted = categories.sort((a, b) => {
      if (a.order !== b.order) return (a.order ?? 999) - (b.order ?? 999);
      return (a.name ?? '').localeCompare(b.name ?? '');
    });
    res.json({ success: true, data: sorted });
  } catch (err) { next(err); }
}

export async function getCategory(req, res, next) {
  try {
    const cat = await findCategoryBySlug(req.params.slug);
    if (!cat || !cat.isActive) return next(new AppError('Category not found.', 404));
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
}

export async function create_Category(req, res, next) {
  try {
    if (req.file) req.body.image = req.file.path;
    const cat = await createCategory(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
}

export async function update_Category(req, res, next) {
  try {
    if (req.file) req.body.image = req.file.path;
    const cat = await updateCategory(req.params.id, req.body);
    if (!cat) return next(new AppError('Category not found.', 404));
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
}

export async function delete_Category(req, res, next) {
  try {
    const cat = await updateCategory(req.params.id, { isActive: false });
    if (!cat) return next(new AppError('Category not found.', 404));
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
}
