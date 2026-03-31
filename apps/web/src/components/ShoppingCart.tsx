'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export function ShoppingCart() {
  const { cart, removeItem, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="bg-gray-900 border-4 border-shit-yellow p-8 rounded">
        <p className="text-gray-400 text-center mb-6">Your cart is empty</p>
        <div className="text-center">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="bg-gray-900 border-4 border-shit-yellow p-6 rounded space-y-4">
        <h2 className="text-2xl font-bold text-shit-yellow font-display">YOUR CART</h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-gray-700 last:border-0"
            >
              {/* Item Image */}
              {item.image && (
                <div className="w-20 h-20 bg-gray-800 rounded flex-shrink-0 border-2 border-gray-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}

              {/* Item Details */}
              <div className="flex-1">
                <h3 className="font-bold text-white">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-400 text-sm">{item.description}</p>
                )}
                <p className="text-shit-yellow font-mono">
                  {item.price.toLocaleString()} DSHIT each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-center text-sm font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-12 h-8 bg-gray-800 border-2 border-gray-600 rounded text-center text-white font-mono"
                  />
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-glitch-red hover:text-glitch-red-dark text-xs font-bold transition-colors"
                >
                  REMOVE
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right flex flex-col justify-between">
                <p className="text-gray-400 text-sm">Subtotal</p>
                <p className="text-shit-yellow font-bold">
                  {(item.price * item.quantity).toLocaleString()} DSHIT
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-900 border-4 border-shit-brown p-6 rounded">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-400">
            <span>Items:</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold">
            <span className="text-white">Total:</span>
            <span className="text-shit-yellow">
              {cart.total.toLocaleString()} DSHIT
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="block w-full px-6 py-4 bg-shit-yellow text-gray-950 font-bold text-lg border-2 border-shit-brown hover:bg-shit-yellow-dark transition-colors text-center rounded"
        >
          PROCEED TO CHECKOUT
        </Link>
      </div>
    </div>
  );
}
