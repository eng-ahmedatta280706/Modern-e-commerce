import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import {
  parseProductFiltersFromSearchParams,
  syncProductFiltersToSearchParams,
} from '../../utils/productFilters';
import { FilteringProducts } from '../../utils/helpers';
import SearchBar from '../../components/search/SearchBar';

const PAGE_SIZE = 12;

const ShopPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const urlFilters = useMemo(
    () => parseProductFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const {
    products,
    filters,
    sortBy,
    setSortBy,
    updateFilter,
    resetFilters,
    categories,
    allColors,
    priceRange,
    totalCount,
  } = useProducts(urlFilters);

  useEffect(() => {
    const syncedFilters = parseProductFiltersFromSearchParams(searchParams);
    (Object.keys(syncedFilters) as (keyof typeof syncedFilters)[]).forEach(key => {
      updateFilter(key, syncedFilters[key]);
    });
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const filteredProducts = FilteringProducts(paginatedProducts, search);

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
    resetFilters();
    navigate({ pathname: location.pathname }, { replace: true });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-500 mt-1">{totalCount} products</p>
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
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <SearchBar
            placeholder="Search products..."
            value={filters.search ?? ''}
            onChange={val => {
              setSearch(val);
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
          />
        </aside>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setFilterOpen(false)}
            />
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
                isOpen
              />
            </div>
          </div>
        )}

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <EmptyState variant="products" onAction={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
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

export default ShopPage;
