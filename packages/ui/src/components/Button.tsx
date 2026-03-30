import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'ghost';
  children: React.ReactNode;
  href?: string;
  disabled?: boolean;
}

/**
 * Button Component - Follows dshit.xyz design system
 *
 * Variants:
 * - main: Yellow solid button with brown shadow (primary actions)
 * - ghost: Transparent with yellow border (secondary actions)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'main', children, className = '', disabled = false, href, ...props }, ref) => {
    const baseClasses = [
      styles.button,
      styles[variant],
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ');

    if (href && !disabled) {
      return (
        <a href={href} className={baseClasses}>
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
