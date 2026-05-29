import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';

type EmptyStateVariant = 'cart' | 'wishlist' | 'search' | 'orders' | 'products';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const variantDefaults: Record<EmptyStateVariant, {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}> = {
  cart: {
    icon: <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />,
    title: 'Your cart is empty',
    description: 'Add some products to your cart to get started.',
    actionLabel: 'Start Shopping',
    actionHref: '/shop',
  },
  wishlist: {
    icon: <Heart size={64} className="mx-auto text-gray-300 mb-4" />,
    title: 'Your wishlist is empty',
    description: 'Save products you love to your wishlist.',
    actionLabel: 'Browse Products',
    actionHref: '/shop',
  },
  search: {
    icon: <Search size={64} className="mx-auto text-gray-300 mb-4" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    actionLabel: 'Clear Filters',
    actionHref: '/shop',
  },
  orders: {
    icon: <Package size={64} className="mx-auto text-gray-300 mb-4" />,
    title: 'No orders yet',
    description: 'When you place an order, it will appear here.',
    actionLabel: 'Shop Now',
    actionHref: '/shop',
  },
  products: {
    icon: <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />,
    title: 'No products found',
    description: 'Try changing your filters or browse other categories.',
    actionLabel: 'View All Products',
    actionHref: '/shop',
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'products',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) => {
  const defaults = variantDefaults[variant];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {defaults.icon}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title ?? defaults.title}</h2>
      <p className="text-gray-500 mb-8 max-w-md">{description ?? defaults.description}</p>
      {onAction ? (
        <button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {actionLabel ?? defaults.actionLabel}
        </button>
      ) : (
        <Link
          to={actionHref ?? defaults.actionHref}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {actionLabel ?? defaults.actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
