import React from 'react';
import styles from './Alert.module.css';

export interface AlertProps {
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Alert Component - Follows dshit.xyz design system
 *
 * Types:
 * - error: Red alert for errors/critical issues
 * - warning: Orange/yellow alert for warnings
 * - success: Green alert for success messages
 * - info: Purple alert for informational messages
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ title, message, type = 'info', icon, className = '' }, ref) => {
    const typeMap = {
      error: styles.typeError,
      warning: styles.typeWarning,
      success: styles.typeSuccess,
      info: styles.typeInfo,
    };

    const iconMap = {
      error: '⚠️',
      warning: '⚡',
      success: '✅',
      info: 'ℹ️',
    };

    return (
      <div
        ref={ref}
        className={[styles.alert, typeMap[type], className].filter(Boolean).join(' ')}
      >
        <div className={styles.tag}>
          {icon || iconMap[type]} {title.toUpperCase()}
        </div>

        <div className={styles.message}>{message}</div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
