import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import { formatPrice } from '../../utils/formatPrice';
import type { Order, OrderStatus } from '../../types/Order';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/Order';

// Mock orders for demo — replace with real API call
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    items: [
      {
        id: '1', name: 'Classic Cotton T-Shirt', price: 24.99, quantity: 2,
        selectedColor: 'White',
        image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        id: '3', name: 'Floral Summer Dress', price: 49.99, quantity: 1,
        selectedColor: 'Blue',
        image: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    ],
    shippingAddress: { name: 'Ahmed Ali', email: 'ahmed@example.com', address: '123 Street', city: 'Asyut', country: 'Egypt' },
    shippingMethod: 'standard',
    paymentMethod: 'card',
    subtotal: 99.97,
    shippingCost: 5,
    tax: 10.50,
    discount: 0,
    total: 115.47,
    status: 'delivered',
    createdAt: '2024-11-15T10:30:00Z',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD-2024-002',
    items: [
      {
        id: '4', name: 'Casual Blazer', price: 89.99, quantity: 1,
        selectedColor: 'Navy',
        image: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    ],
    shippingAddress: { name: 'Ahmed Ali', email: 'ahmed@example.com', address: '123 Street', city: 'Asyut', country: 'Egypt' },
    shippingMethod: 'express',
    paymentMethod: 'paypal',
    subtotal: 89.99,
    shippingCost: 15,
    tax: 9.00,
    discount: 9.00,
    total: 104.99,
    status: 'shipped',
    createdAt: '2024-12-01T14:00:00Z',
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ORD-2024-003',
    items: [
      {
        id: '7', name: 'Running Shoes', price: 99.99, quantity: 1,
        selectedColor: 'Black',
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    ],
    shippingAddress: { name: 'Ahmed Ali', email: 'ahmed@example.com', address: '123 Street', city: 'Asyut', country: 'Egypt' },
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    subtotal: 99.99,
    shippingCost: 5,
    tax: 10.00,
    discount: 0,
    total: 114.99,
    status: 'processing',
    createdAt: '2024-12-10T09:00:00Z',
  },
];

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const statusClass = STATUS_COLORS[order.status as OrderStatus];
  const statusLabel = STATUS_LABELS[order.status as OrderStatus];

  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">{order.id}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <span className="text-sm text-gray-500">Placed on {date}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-900 text-lg">{formatPrice(order.total)}</span>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {expanded ? (
              <><ChevronUp size={16} /> Hide</>
            ) : (
              <><ChevronDown size={16} /> Details</>
            )}
          </button>
        </div>
      </div>

      {/* Order items preview */}
      <div className="p-5">
        <div className="flex gap-3 flex-wrap">
          {order.items.slice(0, 3).map(item => (
            <Link
              key={`${item.id}-${item.selectedColor}`}
              to={`/product/${item.id}`}
              className="group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                )}
              </div>
            </Link>
          ))}
          {order.items.length > 3 && (
            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-200 p-5 space-y-5">
          {/* Items detail */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Items Ordered</h4>
            <div className="space-y-3">
              {order.items.map(item => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Color: {item.selectedColor} · Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-sm text-gray-900 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping ({order.shippingMethod})</span>
              <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span><span>{formatPrice(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping + tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
              <p className="text-gray-600">{order.shippingAddress.name}</p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tracking</h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-700">{order.trackingNumber}</span>
                  <ExternalLink size={14} className="text-blue-500" />
                </div>
                <p className="text-gray-500 mt-1">via {order.shippingMethod} shipping</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Page ─────────────────────────────────────── */
type FilterStatus = 'all' | OrderStatus;

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped' },
  { value: 'delivered',  label: 'Delivered' },
  { value: 'cancelled',  label: 'Cancelled' },
];

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterStatus>('all');

  const filtered = MOCK_ORDERS.filter(
    o => activeTab === 'all' || o.status === activeTab
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'My Orders' }]} />

      <div className="flex items-center gap-3 mb-6">
        <Package size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6 border-b border-gray-200 pb-4">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.value === 'all' && (
              <span className="ml-1.5 text-xs opacity-75">({MOCK_ORDERS.length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState variant="orders" />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
