import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  variant?: 'default' | 'featured' | 'alert';
  tag?: {
    text: string;
    type: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  };
  title?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Card Component - Follows dshit.xyz design system
 *
 * Variants:
 * - default: Standard card with border and padding
 * - featured: Larger card (2 columns in grid)
 * - alert: Alert-style card with warning styling
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', tag, title, body, footer, children, className = '' }, ref) => {
    const tagColorMap = {
      yellow: styles.tagYellow,
      red: styles.tagRed,
      green: styles.tagGreen,
      purple: styles.tagPurple,
      orange: styles.tagOrange,
      brown: styles.tagBrown,
    };

    return (
      <div
        ref={ref}
        className={[
          styles.card,
          styles[variant],
          className
        ].filter(Boolean).join(' ')}
      >
        {tag && (
          <span className={`${styles.tag} ${tagColorMap[tag.type]}`}>
            {tag.text}
          </span>
        )}

        {title && <h3 className={styles.title}>{title}</h3>}

        {body && <p className={styles.body}>{body}</p>}

        {children}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
