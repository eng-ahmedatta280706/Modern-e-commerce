import React, {createContext, useState, useEffect, ReactNode} from 'react';
import type { Product } from '../types/Product';

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  price: number; // Ensure price is a number
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedColor: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

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

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // Total number of individual units in the cart (sum of quantities).
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, selectedColor: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex >= 0) {
        // Add to the existing quantity rather than overwriting it.
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor, price: product.price }];
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

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
