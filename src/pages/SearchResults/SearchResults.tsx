import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { useProducts } from '../../hooks/useProducts';

const PAGE_SIZE = 12;

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [currentPage, setCurrentPage] = useState(1);

  const { products, updateFilter, totalCount } = useProducts({ search: query });

  // Sync URL query → filter whenever URL changes
  useEffect(() => {
    updateFilter('search', query || undefined);
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Search Results' }]} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search size={24} className="text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : 'All Products'}
          </h1>
        </div>
        <p className="text-gray-500 ml-9">
          {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="ml-3 text-blue-600 hover:underline text-sm"
            >
              Clear search
            </button>
          )}
        </p>
      </div>

      {/* Related categories */}
      {query && totalCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Browse in:</span>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="px-3 py-1 text-sm border rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {paginatedProducts.length === 0 ? (
        <EmptyState
          variant="search"
          description={query ? `No products match "${query}". Try a different search term.` : undefined}
          actionLabel="Browse All Products"
          actionHref="/shop"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
    </div>
  );
};

export default SearchResultsPage;
