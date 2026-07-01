import type { ProductFilters } from '../hooks/useProducts';

const FILTER_KEYS: (keyof ProductFilters)[] = [
    'category',
    'brand',
    'subcategory',
    'badge',
    'search',
    'minPrice',
    'maxPrice',
    'colors',
];

export const parseProductFiltersFromSearchParams = (
    searchParams: URLSearchParams,
    defaults: ProductFilters = {}
): ProductFilters => {
    const colors = searchParams.get('colors');
    const brands = searchParams.get('brand');

    return {
        ...defaults,
        category: searchParams.get('category') ?? defaults.category,
        brand: searchParams.get('brand') ?? defaults.brand,
        subcategory: searchParams.get('subcategory') ?? defaults.subcategory,
        badge: searchParams.get('badge') ?? defaults.badge,
        search: searchParams.get('q') ?? searchParams.get('search') ?? defaults.search,
        minPrice: searchParams.get('minPrice')
            ? Number(searchParams.get('minPrice'))
            : defaults.minPrice,
        maxPrice: searchParams.get('maxPrice')
            ? Number(searchParams.get('maxPrice'))
            : defaults.maxPrice,
        colors: colors
            ? colors.split(',').map(color => color.trim()).filter(Boolean)
            : defaults.colors,
        brands: brands
            ? brands.split(',').map(brand => brand.trim()).filter(Boolean)
            : defaults.brands,
    };
};

export const syncProductFiltersToSearchParams = (
    searchParams: URLSearchParams,
    filters: ProductFilters
): URLSearchParams => {
    const next = new URLSearchParams(searchParams);

    for (const key of FILTER_KEYS) {
        if (key === 'colors') continue;
        next.delete(key === 'search' ? 'q' : key);
        next.delete(key === 'search' ? 'search' : key);
    }

    if (filters.category) next.set('category', filters.category);
    if (filters.brand) next.set('brand', filters.brand);
    if (filters.subcategory) next.set('subcategory', filters.subcategory);
    if (filters.badge) next.set('badge', filters.badge);
    if (filters.search) next.set('q', filters.search);
    if (filters.minPrice !== undefined) next.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) next.set('maxPrice', String(filters.maxPrice));
    if (filters.colors && filters.colors.length > 0) next.set('colors', filters.colors.join(','));
    if (filters.brand) next.set('brand', filters.brand);
    else next.delete('colors');

    return next;
};

export const clearProductFiltersFromSearchParams = (
    searchParams: URLSearchParams
): URLSearchParams => {
    const next = new URLSearchParams(searchParams);
    ['category', 'brand', 'subcategory', 'badge', 'q', 'search', 'minPrice', 'maxPrice', 'colors'].forEach(key => next.delete(key));
    return next;
};
