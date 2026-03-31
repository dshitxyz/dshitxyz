'use client';

import { useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number; // in DSHIT tokens
  quantity: number;
  image?: string;
  description?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'dshit_cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (err) {
        console.error('Failed to parse cart from localStorage:', err);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.id === product.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevCart.items, { ...product, quantity: 1 }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== productId);
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  };

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
