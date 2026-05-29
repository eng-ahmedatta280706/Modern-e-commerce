import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../../types/Product';

interface ProductGridProps {
  title?: string;
  products: Product[];
  viewAllLink?: string;
  columns?: 2 | 3 | 4 | 5;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  products,
  viewAllLink,
  columns = 5,
}) => {
  if (products.length === 0) {
    return (
      <section className="py-8">
        {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {(viewAllLink ?? products.length > 8) && (
            <Link
              to={viewAllLink ?? '/shop'}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All
            </Link>
          )}
        </div>
      )}

      <div className={`grid ${columnClasses[columns]} gap-4 md:gap-6`}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
