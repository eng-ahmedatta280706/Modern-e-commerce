import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo
} from 'react';
import type { Product } from '../types/Product';

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedColor: string) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CART_STORAGE_KEY = 'stylestore_cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);

  // ✅ Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      console.error('Failed to persist cart to localStorage');
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Fixed: total number of individual units in cart
  const totalItems = cartItems.length;

  const addToCart = (product: Product, selectedColor: string) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex >= 0) {
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.selectedColor === selectedColor))
    );
  };

  const updateQuantity = (productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  }), [cartItems, subtotal, totalItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};