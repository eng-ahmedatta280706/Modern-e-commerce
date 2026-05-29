import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import { localProducts } from '../../data/products';
import { subCategories } from '../../data/categories';
import type { CategoryKey } from '../../types/Category';
import { slugify, toTitleCase } from '../../utils/helpers';

/* ── helpers ─────────────────────────────────── */
const slugToCategory: Record<string, CategoryKey> = {
  'new-arrivals': 'newArrivals',
  'women': 'women',
  'men': 'men',
  'kids': 'kids',
  'accessories': 'accessories',
  'sale': 'sale',
};

const categoryImages: Record<string, string> = {
  women: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600',
  men:   'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600',
  accessories: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=1600',
  shoes: 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1600',
  sale:  'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=1600',
  kids:  'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=1600',
  newarrivals: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

const CategoryPage: React.FC = () => {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>();

  const categoryKey = slugToCategory[categorySlug] ?? null;
  const categoryLabel = toTitleCase(categorySlug.replace(/-/g, ' '));

  // Products matching this category (case-insensitive)
  const categoryProducts = useMemo(() =>
    localProducts.filter(p =>
      p.category.toLowerCase() === categoryLabel.toLowerCase() ||
      (categoryKey === 'newArrivals' && p.badge === 'New') ||
      (categoryKey === 'sale' && p.badge === 'Sale')
    ),
    [categoryLabel, categoryKey]
  );

  // Group products by subcategory for section display
  const productsBySubcategory = useMemo(() => {
    const groups: Record<string, typeof categoryProducts> = {};
    categoryProducts.forEach(p => {
      const sub = p.subcategory ?? 'Other';
      if (!groups[sub]) groups[sub] = [];
      groups[sub].push(p);
    });
    return groups;
  }, [categoryProducts]);

  const subcategoryData = categoryKey ? subCategories[categoryKey] : null;
  const heroImage = categoryImages[categorySlug.replace(/-/g, '')] ?? categoryImages.newarrivals;

  if (!categoryKey && categoryProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: categoryLabel }]} /> */}
        <EmptyState variant="products" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={heroImage}
          alt={categoryLabel}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{categoryLabel}</h1>
          <p className="text-lg opacity-90">{categoryProducts.length} products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: categoryLabel }]} />

        {/* Subcategory quick-links */}
        {subcategoryData && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Type</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(subcategoryData).flatMap(([, items]) =>
                (items as string[]).map(item => (
                  <Link
                    key={item}
                    to={`/category/${categorySlug}/${slugify(item)}`}
                    className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Products grouped by subcategory */}
        {Object.keys(productsBySubcategory).length > 0 ? (
          Object.entries(productsBySubcategory).map(([sub, products]) => (
            <div key={sub} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{sub}</h2>
                <Link
                  to={`/category/${categorySlug}/${slugify(sub)}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.slice(0, 5).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState variant="products" />
        )}
      </div>
    </div>
  );
};

// Local import to avoid circular dep
import ProductCard from '../../components/product/ProductCard';

export default CategoryPage;
