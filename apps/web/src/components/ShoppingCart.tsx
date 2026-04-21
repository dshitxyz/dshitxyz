'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ShoppingCart.module.css';
import { CartItem } from '@/hooks/useCart';

interface ShoppingCartProps {
  items: CartItem[];
  total: number;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function ShoppingCart({
  items,
  total,
  onRemoveItem,
  onUpdateQuantity,
}: ShoppingCartProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyContent}>
          <h3>Your cart is empty</h3>
          <p>Start adding products to get started</p>
          <Link href="/products" className={styles.continueButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <h2 className={styles.title}>Shopping Cart</h2>

      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.image && (
              <img src={item.image} alt={item.name} className={styles.image} />
            )}

            <div className={styles.itemContent}>
              <div>
                <h4 className={styles.itemName}>{item.name}</h4>
                {item.description && (
                  <p className={styles.itemDesc}>{item.description}</p>
                )}
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className={styles.qtyBtn}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className={styles.qtyInput}
                  />
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.price}>
                  {(item.price * item.quantity).toLocaleString()} DSHIT
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span>Subtotal:</span>
          <span>{total.toLocaleString()} DSHIT</span>
        </div>
        <div className={styles.row}>
          <span>Items:</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Total:</span>
          <span className={styles.totalAmount}>
            {total.toLocaleString()} DSHIT
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/products" className={styles.secondaryBtn}>
          Continue Shopping
        </Link>
        <Link href="/checkout" className={styles.primaryBtn}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
