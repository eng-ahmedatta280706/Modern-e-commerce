import React from 'react';

type BadgeVariant =
  | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  | 'approved' | 'rejected' | 'suspended' | 'active' | 'inactive'
  | 'paid' | 'failed' | 'new' | 'sale' | 'best-seller';

const variantStyles: Record<BadgeVariant, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  processing:  'bg-blue-100 text-blue-700',
  shipped:     'bg-purple-100 text-purple-700',
  delivered:   'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-700',
  refunded:    'bg-gray-100 text-gray-700',
  approved:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
  suspended:   'bg-orange-100 text-orange-700',
  active:      'bg-green-100 text-green-700',
  inactive:    'bg-gray-100 text-gray-500',
  paid:        'bg-green-100 text-green-700',
  failed:      'bg-red-100 text-red-700',
  new:         'bg-blue-100 text-blue-700',
  sale:        'bg-red-100 text-red-700',
  'best-seller': 'bg-orange-100 text-orange-700',
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const key = status.toLowerCase().replace(/\s+/g, '-') as BadgeVariant;
  const style = variantStyles[key] ?? 'bg-gray-100 text-gray-600';
  const textSize = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium rounded-full capitalize ${style} ${textSize}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
