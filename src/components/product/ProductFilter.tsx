import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters, SortOption } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/formatPrice';

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
}

const colorMap: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  green: '#10B981', yellow: '#F59E0B', purple: '#8B5CF6', pink: '#EC4899',
  gray: '#6B7280', navy: '#1E3A8A', brown: '#92400E', beige: '#E5E7EB',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

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

  return (
    <aside className="w-full">
      {/* Mobile toggle */}
      <button
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{totalCount} results</span>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-red-500 hover:text-red-700"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
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
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onFilterChange('category', undefined)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!filters.category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Categories
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onFilterChange('category', cat)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.category === cat ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
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
                  key={color}
                  title={color}
                  aria-pressed={isActive}
                  onClick={() => toggleColor(color)}
                  className={`rounded-full transition-all ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : 'ring-1 ring-gray-200'}`}
                  style={{
                    backgroundColor: colorMap[color.toLowerCase()] ?? color,
                    width: 28,
                    height: 28,
                    border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none',
                  }}
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
              onClick={() => onFilterChange('badge', undefined)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!filters.badge ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Types
            </button>
            {BADGE_OPTIONS.map(badge => (
              <button
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
