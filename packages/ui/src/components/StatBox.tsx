import React from 'react';
import styles from './StatBox.module.css';

export interface StatBoxProps {
  number: string | number;
  label: string;
  subLabel?: string;
  accentColor?: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  className?: string;
}

/**
 * StatBox Component - Follows dshit.xyz design system
 *
 * Displays key metrics with:
 * - Large bold number
 * - Label text
 * - Optional sub-stat
 * - Top accent bar with configurable color
 */
export const StatBox = React.forwardRef<HTMLDivElement, StatBoxProps>(
  ({ number, label, subLabel, accentColor = 'yellow', className = '' }, ref) => {
    const colorMap = {
      yellow: styles.accentYellow,
      red: styles.accentRed,
      green: styles.accentGreen,
      purple: styles.accentPurple,
      orange: styles.accentOrange,
      brown: styles.accentBrown,
    };

    return (
      <div
        ref={ref}
        className={[styles.statBox, className].filter(Boolean).join(' ')}
      >
        <div className={`${styles.accent} ${colorMap[accentColor]}`} />

        <div className={styles.number}>{number}</div>

        <div className={styles.label}>{label}</div>

        {subLabel && <div className={styles.subLabel}>{subLabel}</div>}
      </div>
    );
  }
);

StatBox.displayName = 'StatBox';
