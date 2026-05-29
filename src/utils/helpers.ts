/**
 * Returns a deterministic list of related products by category
 * (avoids re-sorting on every render when used with useMemo)
 */
import type { Product } from '../types/Product';

export const getRelatedProducts = (
  products: Product[],
  currentId: string,
  category: string,
  limit = 4
): Product[] =>
  products
    .filter(p => p.id !== currentId && p.category === category)
    .slice(0, limit);

/**
 * Truncates a string to maxLength and appends '...'
 */
export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

/**
 * Capitalizes first letter of each word.
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

/**
 * Groups an array by a key function.
 */
export const groupBy = <T>(arr: T[], key: (item: T) => string): Record<string, T[]> =>
  arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

/**
 * Creates a URL-friendly slug from a string.
 */
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
