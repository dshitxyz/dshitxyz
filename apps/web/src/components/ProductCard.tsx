'use client';

import React, { useState } from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number; // in DSHIT
  image?: string;
  onAddToCart: (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
  }) => void;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart({
      id,
      name,
      price,
      image,
      description,
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className={styles.card}>
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={name} className={styles.image} />
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.amount}>{price.toLocaleString()}</span>
            <span className={styles.currency}>DSHIT</span>
          </div>

          <button
            className={`${styles.button} ${isAdding ? styles.adding : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? '✓ ADDED' : '+ CART'}
          </button>
        </div>
      </div>
    </div>
  );
}
