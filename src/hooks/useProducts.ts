import { useMemo, useState } from 'react';
import { localProducts } from '../data/products';
import type { Product } from '../types/Product';

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
  search?: string;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

const sortProducts = (products: Product[], sort: SortOption): Product[] => {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return copy.filter(p => p.badge === 'New').concat(copy.filter(p => p.badge !== 'New'));
    default:
      return copy;
  }
};

export const useProducts = (initialFilters: ProductFilters = {}) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredProducts = useMemo(() => {
    let result = [...localProducts];

    if (filters.category) {
      result = result.filter(
        p => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    if (filters.subcategory) {
      result = result.filter(
        p => p.subcategory?.toLowerCase() === filters.subcategory!.toLowerCase()
      );
    }
    if (filters.badge) {
      result = result.filter(p => p.badge === filters.badge);
    }
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter(p =>
        filters.colors!.some(c => p.colors.includes(c))
      );
    }
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags ?? []).some(t => t.toLowerCase().includes(q))
      );
    }

    return sortProducts(result, sortBy);
  }, [filters, sortBy]);

  const updateFilter = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const categories = useMemo(
    () => [...new Set(localProducts.map(p => p.category))],
    []
  );

  const allColors = useMemo(
    () => [...new Set(localProducts.flatMap(p => p.colors))],
    []
  );

  const priceRange = useMemo(() => ({
    min: Math.min(...localProducts.map(p => p.price)),
    max: Math.max(...localProducts.map(p => p.price)),
  }), []);

  return {
    products: filteredProducts,
    filters,
    sortBy,
    setSortBy,
    updateFilter,
    resetFilters,
    categories,
    allColors,
    priceRange,
    totalCount: filteredProducts.length,
  };
};
