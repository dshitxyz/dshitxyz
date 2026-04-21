'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number; // in DSHIT
  quantity: number;
  image?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = 'dshit_cart';

export function useCart() {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartState;
        setCart(parsed);
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          total: prev.total + item.price,
        };
      }
      return {
        items: [...prev.items, { ...item, quantity: 1 }],
        total: prev.total + item.price,
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;
      return {
        items: prev.items.filter((i) => i.id !== itemId),
        total: prev.total - item.price * item.quantity,
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;
      const diff = quantity - item.quantity;
      return {
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
        total: prev.total + item.price * diff,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    items: cart.items,
    total: cart.total,
    itemCount: cart.items.length,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
