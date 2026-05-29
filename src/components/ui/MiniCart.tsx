import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

interface MiniCartProps {
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { onClose(); setClosing(false); }, 200);
  };

  return (
    <div
      className={`absolute top-full right-0 mt-2 w-72 md:w-96 bg-white rounded-lg shadow-xl z-50 ${
        closing ? 'animate-slideOut' : 'animate-slideIn'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">
          Your Cart{' '}
          <span className="text-gray-400 font-normal">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-1">
          <X size={18} />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={onClose}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {cartItems.map(item => (
              <li key={`${item.id}-${item.selectedColor}`} className="py-4 flex gap-3">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                    <p className="text-sm font-medium ml-2 flex-shrink-0">{formatPrice(item.price)}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">Color: {item.selectedColor}</p>

                  <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Decrease"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t p-4">
          <div className="flex justify-between text-sm mb-4">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-semibold">{formatPrice(subtotal)}</p>
          </div>
          <div className="space-y-2">
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-center block hover:bg-blue-700 transition-colors font-medium text-sm"
              onClick={onClose}
            >
              Checkout
            </Link>
            <Link
              to="/shop"
              className="w-full border border-gray-300 py-2.5 px-4 rounded-lg text-center block hover:bg-gray-50 transition-colors text-sm"
              onClick={onClose}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
