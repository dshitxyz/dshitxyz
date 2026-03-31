'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import styles from './products.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, itemCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/drops');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        // Transform API response to products
        const products: Product[] = [
          {
            id: 'shit-box',
            name: 'The Shit Box',
            description: 'A mysterious brown box. What\'s inside?',
            price: 100,
            image: '/products/box.png',
          },
          {
            id: 'turd-toy',
            name: 'Rubber Turd Toy',
            description: 'Realistic poop-shaped stress relief toy',
            price: 50,
            image: '/products/turd.png',
          },
          {
            id: 'fart-horn',
            name: 'Fart Sound Horn',
            description: 'Embarrass your friends with authentic fart sounds',
            price: 75,
            image: '/products/horn.png',
          },
          {
            id: 'poop-emoji',
            name: 'Poop Emoji Pillow',
            description: 'Soft, squishy, stinky comfort',
            price: 150,
            image: '/products/pillow.png',
          },
          {
            id: 'toilet-paper',
            name: 'Luxury Toilet Paper Roll',
            description: 'Gold-plated for the truly distinguished',
            price: 200,
            image: '/products/tp.png',
          },
          {
            id: 'shit-cologne',
            name: 'Eau de Shit Cologne',
            description: 'Smell like success (literally)',
            price: 300,
            image: '/products/cologne.png',
          },
          {
            id: 'poop-socks',
            name: 'Poop Pattern Socks',
            description: 'Wear your values on your feet',
            price: 40,
            image: '/products/socks.png',
          },
          {
            id: 'brown-hoodie',
            name: 'DSHIT Brown Hoodie',
            description: 'Comfortable brutalist apparel',
            price: 250,
            image: '/products/hoodie.png',
          },
        ];

        setProducts(products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Use mock products even on error
        const mockProducts: Product[] = [
          {
            id: 'shit-box',
            name: 'The Shit Box',
            description: 'A mysterious brown box. What\'s inside?',
            price: 100,
          },
          {
            id: 'turd-toy',
            name: 'Rubber Turd Toy',
            description: 'Realistic poop-shaped stress relief toy',
            price: 50,
          },
          {
            id: 'fart-horn',
            name: 'Fart Sound Horn',
            description: 'Embarrass your friends with authentic fart sounds',
            price: 75,
          },
          {
            id: 'poop-emoji',
            name: 'Poop Emoji Pillow',
            description: 'Soft, squishy, stinky comfort',
            price: 150,
          },
        ];
        setProducts(mockProducts);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
  }) => {
    addItem(product);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Product Catalog</h1>
            <p className={styles.subtitle}>
              Browse our collection of premium gag items and novelties
            </p>
          </div>
          <div className={styles.badge}>
            {itemCount} items in cart
          </div>
        </header>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Error: {error}</p>
            <p>Showing available products</p>
          </div>
        ) : null}

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className={styles.empty}>
            <h2>No products available</h2>
            <p>Check back soon for new items!</p>
          </div>
        )}
      </div>
    </div>
  );
}
