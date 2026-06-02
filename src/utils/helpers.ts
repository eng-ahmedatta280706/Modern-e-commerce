/**
 * Returns a deterministic list of related products by category
 * (avoids re-sorting on every render when used with useMemo)
 */
import type { Product } from '../types/Product';
import { useState } from 'react';


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

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  const alen = a.length;
  const blen = b.length;

  for (let i = 0; i <= alen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= blen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[alen][blen];
}

export const fuzzyMatch = (str: string, query: string, threshold = 3): boolean =>
  levenshtein(str.toLowerCase(), query.toLowerCase()) <= threshold;

export const filteration = (products: Product[], query: string): Product[] =>
  products.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    return (
      name.includes(query.toLowerCase()) ||
      description.includes(query.toLowerCase()) ||
      fuzzyMatch(name, query) ||
      fuzzyMatch(description, query)
    );
  });

export const FilteringProducts = (products: Product[] , search: string): Product[] => { 
  return products.filter((item) => {
    if (!search) return true;
    const name = item.name?.toLowerCase() || "";
    const query = search.toLowerCase();

    // substring match
    if (name.includes(query)) return true;

    // fuzzy match: allow small edit distance
    const distance = levenshtein(name, query);
    const threshold = Math.floor(Math.max(name.length, query.length) * 0.3);
    return distance <= threshold;
  });
}
