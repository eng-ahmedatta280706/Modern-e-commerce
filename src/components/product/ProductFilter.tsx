import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters, SortOption } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/formatPrice';
// import { FilteringProducts } from '../../utils/helpers';
// import SearchBar from '../search/SearchBar';

interface ProductFilterProps {
  filters: ProductFilters;
  sortBy: SortOption;
  categories: string[];
  allColors: string[];
  priceRange: { min: number; max: number };
  totalCount: number;
  onFilterChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  categoryLabel?: string;
}

const colorClassMap: Record<string, string> = {
  black: 'bg-black',
  white: 'bg-white border border-gray-200',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500',
  navy: 'bg-[#1E3A8A]',
  brown: 'bg-[#92400E]',
  beige: 'bg-[#E5E7EB]',
  Tan: 'bg-[#D2B48C]',
  Cream: 'bg-[#FFFDD0]',
  Blush: 'bg-[#FFC0CB]',
  LightBlue: 'bg-[#ADD8E6]',
  Olive: 'bg-[#808000]',
  Beige: 'bg-[#F5F5DC]',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

const BRAND_OPTIONS = ['Brand A', 'Brand B', 'Brand C'];

const BADGE_OPTIONS = ['New', 'Sale', 'Best Seller'];

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  sortBy,
  categories,
  allColors,
  priceRange,
  totalCount,
  onFilterChange,
  onSortChange,
  onReset,
  isOpen = true,
  onToggle,
  categoryLabel,
}) => {
  const hasActiveFilters =
    filters.category ||
    filters.subcategory ||
    filters.badge ||
    (filters.colors && filters.colors.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.search;

  const toggleColor = (color: string) => {
    const current = filters.colors ?? [];
    const next = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    onFilterChange('colors', next.length > 0 ? next : undefined);
  };

  // const filteredProducts = FilteringProducts(paginatedProducts, search);

  return (
    <aside className="w-full">
      {/* Mobile toggle */}
      <button
        type="button"
        className="lg:hidden flex items-center gap-2 mb-4 text-gray-700 font-medium border rounded-lg px-4 py-2"
        onClick={onToggle}
      >
        <SlidersHorizontal size={18} />
        Filters {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">Active</span>}
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {!categoryLabel && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{totalCount} results</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sort */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 text-sm uppercase tracking-wide">Sort By</h4>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">Category</h4>
          {/* If we're on a category page, show that category as selected and disable changing it */}
          {categoryLabel ? (
            <button
              type="button"
              disabled
              className="w-full text-left text-sm px-2 py-1.5 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
            >
              {categoryLabel}
            </button>
          ) : (
            <select
              value={filters.category ?? ''}
              onChange={e => onFilterChange('category', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">Brand</h4>
          <select
            value={filters.brand ?? ''}
            onChange={e => onFilterChange('brand', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {BRAND_OPTIONS.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">Price Range</h4>
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder={`${priceRange.min}`}
                value={filters.minPrice ?? ''}
                min={priceRange.min}
                max={priceRange.max}
                onChange={e => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400 text-sm">–</span>
              <input
                type="number"
                placeholder={`${priceRange.max}`}
                value={filters.maxPrice ?? ''}
                min={priceRange.min}
                max={priceRange.max}
                onChange={e => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-gray-400 flex justify-between">
              <span>{formatPrice(priceRange.min)}</span>
              <span>{formatPrice(priceRange.max)}</span>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {allColors.map(color => {
              const isActive = (filters.colors ?? []).includes(color);
              return (
                <button
                  type="button"
                  key={color}
                  title={color}
                  onClick={() => toggleColor(color)}
                  className={`h-7 w-7 rounded-full transition-all ${colorClassMap[color.toLowerCase()] ?? 'bg-gray-200'} ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : 'ring-1 ring-gray-200'}`}
                />
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">Product Type</h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onFilterChange('badge', undefined)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!filters.badge ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Types
            </button>
            {BADGE_OPTIONS.map(badge => (
              <button
                type="button"
                key={badge}
                onClick={() => onFilterChange('badge', badge)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.badge === badge ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {badge}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;
