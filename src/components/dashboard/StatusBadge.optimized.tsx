import React, { memo, useMemo } from 'react';

type BadgeVariant =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'active'
  | 'inactive'
  | 'paid'
  | 'failed'
  | 'new'
  | 'sale'
  | 'best-seller';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-brand-100 text-brand-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-orange-100 text-orange-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  new: 'bg-brand-100 text-brand-700',
  sale: 'bg-red-100 text-red-700',
  'best-seller': 'bg-orange-100 text-orange-700',
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const normalizeStatus = (status: string): string =>
  status.trim().toLowerCase().replace(/\s+/g, '-');

const StatusBadge: React.FC<StatusBadgeProps> = memo(
  ({ status, size = 'md' }) => {
    const normalizedStatus = useMemo(
      () => normalizeStatus(status),
      [status],
    );

    const style =
      VARIANT_STYLES[normalizedStatus as BadgeVariant] ??
      'bg-gray-100 text-gray-600';

    const textSize =
      size === 'sm'
        ? 'text-xs px-2 py-0.5'
        : 'text-xs px-2.5 py-1';

    const label = status.trim() || 'Unknown';

    return (
      <span
        className={`inline-flex items-center font-medium rounded-full capitalize ${style} ${textSize}`}
      >
        {label}
      </span>
    );
  },
);

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
