'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { ShoppingCart } from '@/components/ShoppingCart';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-shit-yellow font-display">
            SHOPPING CART
          </h1>
        </div>

        {/* Shopping Cart Component */}
        <ShoppingCart />
      </div>
    </div>
  );
}
