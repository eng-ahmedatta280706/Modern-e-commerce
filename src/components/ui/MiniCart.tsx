import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface MiniCartProps {
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [closing, setClosing] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + (item.name ? 1 : 0), 0);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 200);
  };

  return (
    <div className={`absolute top-full right-0 mt-2 w-72 md:w-96 bg-white rounded-lg shadow-xl z-50 ${closing ? 'animate-slideOut' : 'animate-slideIn'
      }`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Your Cart ({totalItems} items)</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Cart items */}
      <div className="max-h-80 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Your cart is empty</p>
            <Link
              to="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              onClick={onClose}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.selectedColor}`} className="py-4 flex">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Color: {item.selectedColor}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.selectedColor, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-1 text-gray-600 hover:text-gray-800"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.selectedColor, item.quantity + 1)
                        }
                        className="px-2 py-1 text-gray-600 hover:text-gray-800"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="text-xs font-medium text-red-600 hover:text-red-800"
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
            <p>Subtotal</p>
            <p className="font-medium">${subtotal.toFixed(2)}</p>
          </div>
          <div className="mt-4">
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              Checkout
            </Link>
            <button
              className="w-full mt-2 border border-gray-300 py-2 px-4 rounded-lg text-center block hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;