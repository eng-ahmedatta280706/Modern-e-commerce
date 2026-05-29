import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { toTitleCase } from '../../utils/helpers';

const PAGE_SIZE = 12;

const SubcategoryPage: React.FC = () => {
  const { categorySlug = '', subcategorySlug = '' } = useParams<{
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const categoryLabel = toTitleCase(categorySlug.replace(/-/g, ' '));
  const subcategoryLabel = toTitleCase(subcategorySlug.replace(/-/g, ' '));

  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

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
  } = useProducts({
    category: categoryLabel,
    subcategory: subcategoryLabel,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    updateFilter(key, value as any);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
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
          <ProductFilter
            filters={filters}
            sortBy={sortBy}
            categories={categories}
            allColors={allColors}
            priceRange={priceRange}
            totalCount={totalCount}
            onFilterChange={handleFilterChange}
            onSortChange={val => { setSortBy(val); setCurrentPage(1); }}
            onReset={() => { resetFilters(); setCurrentPage(1); }}
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
                onReset={() => { resetFilters(); setCurrentPage(1); setFilterOpen(false); }}
                isOpen
              />
            </div>
          </div>
        )}

        {/* Products */}
        <main className="flex-1 min-w-0">
          {paginatedProducts.length === 0 ? (
            <EmptyState variant="products" onAction={resetFilters} />
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
