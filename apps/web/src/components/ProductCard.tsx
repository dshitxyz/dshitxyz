'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tag?: {
    text: string;
    type: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  };
}

const tagColors = {
  yellow: 'bg-shit-yellow text-gray-950',
  red: 'bg-glitch-red text-white',
  green: 'bg-toxic-green text-gray-950',
  purple: 'bg-cyber-purple text-white',
  orange: 'bg-industrial-orange text-gray-950',
  brown: 'bg-shit-brown text-white',
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-gray-900 border-4 border-gray-700 hover:border-shit-yellow rounded overflow-hidden transition-all hover:shadow-lg">
      {/* Product Image */}
      {product.image ? (
        <div className="w-full h-48 bg-gray-800 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-800 flex items-center justify-center border-b-2 border-gray-700">
          <span className="text-gray-600 font-mono">NO IMAGE</span>
        </div>
      )}

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Tag */}
        {product.tag && (
          <div
            className={`inline-block px-2 py-1 text-xs font-bold rounded ${
              tagColors[product.tag.type as keyof typeof tagColors]
            }`}
          >
            {product.tag.text}
          </div>
        )}

        {/* Name */}
        <h3 className="text-white font-bold line-clamp-2">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
        )}

        {/* Price & Button */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <p className="text-shit-yellow font-bold font-mono">{product.price} DSHIT</p>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-3 py-2 text-sm font-bold border-2 rounded transition-all ${
              isAdding
                ? 'bg-shit-yellow text-gray-950 border-shit-yellow'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-shit-yellow hover:text-shit-yellow'
            }`}
          >
            {isAdding ? '✓ ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
}
