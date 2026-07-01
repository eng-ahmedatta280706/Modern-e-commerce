import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { toTitleCase } from '../../utils/helpers';
import {
  parseProductFiltersFromSearchParams,
  syncProductFiltersToSearchParams,
} from '../../utils/productFilters';
import SearchBar from '../../components/search/SearchBar';

const PAGE_SIZE = 12;


const SubcategoryPage: React.FC = () => {
  const { categorySlug = '', subcategorySlug = '' } = useParams<{
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const categoryLabel = toTitleCase(categorySlug.replace(/-/g, ' '));
  const subcategoryLabel = toTitleCase(subcategorySlug.replace(/-/g, ' '));

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const routeBaseFilters = useMemo(() => {
    if (categorySlug === 'new-arrivals') {
      return { badge: 'New' as const, subcategory: subcategoryLabel };
    }

    if (categorySlug === 'sale') {
      return { badge: 'Sale' as const, subcategory: subcategoryLabel };
    }

    return { category: categoryLabel, subcategory: subcategoryLabel };
  }, [categorySlug, categoryLabel, subcategoryLabel]);

  const urlFilters = useMemo(
    () => parseProductFiltersFromSearchParams(searchParams, {
      ...routeBaseFilters,
    }),
    [searchParams, routeBaseFilters]
  );

  const {
    products,
    filters,
    sortBy,
    setSortBy,
    updateFilter,
    resetFilters,
    categories,
    brands,
    allColors,
    priceRange,
    totalCount,
  } = useProducts(urlFilters);

  useEffect(() => {
    const syncedFilters = parseProductFiltersFromSearchParams(searchParams, {
      ...routeBaseFilters,
    });
    (Object.keys(syncedFilters) as (keyof typeof syncedFilters)[]).forEach(key => {
      updateFilter(key, syncedFilters[key]);
    });
    setCurrentPage(1);
  }, [searchParams, routeBaseFilters, updateFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    const nextFilters = key === 'category'
      ? { ...filters, category: value as string | undefined, subcategory: undefined }
      : { ...filters, [key]: value };
    updateFilter(key, value);
    if (key === 'category') {
      updateFilter('subcategory', undefined);
    }
    const nextParams = syncProductFiltersToSearchParams(searchParams, nextFilters);
    navigate({ pathname: location.pathname, search: nextParams.toString() ? `?${nextParams.toString()}` : '' }, { replace: true });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    resetFilters({ ...routeBaseFilters });
    navigate({ pathname: location.pathname }, { replace: true });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          // { label: 'Shop', href: '/shop' },
          { label: categoryLabel, href: `/category/${categorySlug}` },
          { label: subcategoryLabel },
        ]}
      />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{subcategoryLabel}</h1>
          <p className="text-gray-500 mt-1">
            in <Link to={`/category/${categorySlug}`} className="text-blue-600 hover:underline">{categoryLabel}</Link>
            {' '}· {totalCount} products
          </p>
        </div>
        <button
          className="lg:hidden flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium"
          onClick={() => setFilterOpen(prev => !prev)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <SearchBar
            placeholder="Search products..."
            value={filters.search ?? ''}
            onChange={val => {
              handleFilterChange('search', val || undefined);
            }}
          />
          <ProductFilter
            filters={filters}
            sortBy={sortBy}
            categories={categories}
            allColors={allColors}
            priceRange={priceRange}
            totalCount={totalCount}
            onFilterChange={handleFilterChange}
            onSortChange={val => { setSortBy(val); setCurrentPage(1); }}
            onReset={handleResetFilters}
            categoryLabel={categoryLabel}
            Brands={brands}
          />
        </aside>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <ProductFilter
                filters={filters}
                sortBy={sortBy}
                categories={categories}
                allColors={allColors}
                priceRange={priceRange}
                totalCount={totalCount}
                onFilterChange={handleFilterChange}
                onSortChange={val => { setSortBy(val); setCurrentPage(1); setFilterOpen(false); }}
                onReset={() => { handleResetFilters(); setFilterOpen(false); }}
                categoryLabel={categoryLabel}
                Brands={brands}
                isOpen
              />
            </div>
          </div>
        )}

        {/* Products */}
        <main className="flex-1 min-w-0">
          {products.length === 0 ? (
            <EmptyState variant="products" onAction={() => navigate('/shop')} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubcategoryPage;
