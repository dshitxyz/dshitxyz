'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  title?: string;
  tag?: {
    text: string;
    type: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  };
  featured?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/stats/drops');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        // Convert drops to products with prices
        const productsWithPrices = data.map((drop: any, index: number) => ({
          id: drop.id,
          name: drop.title,
          description: drop.description,
          price: 500 + index * 100, // Example pricing
          title: drop.title,
          tag: drop.tag,
          featured: drop.featured,
        }));

        setProducts(productsWithPrices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-shit-yellow font-display">
            PRODUCT CATALOG
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Browse our collection of premium gag gifts and novelty items. All prices in $DSHIT tokens.
          </p>
        </div>

        {/* Cart Link */}
        <div className="mb-8 flex gap-4">
          <Link
            href="/cart"
            className="px-6 py-3 bg-gray-800 text-gray-300 font-bold border-2 border-gray-700 hover:border-shit-yellow hover:text-shit-yellow transition-colors rounded"
          >
            VIEW CART
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-glitch-red bg-opacity-20 border-l-4 border-glitch-red p-4 rounded text-glitch-red mb-8">
            Failed to load products: {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 border-4 border-gray-700 rounded h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && !error && (
          <div className="bg-gray-900 border-4 border-shit-yellow p-8 rounded text-center">
            <p className="text-gray-400 mb-6">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}
