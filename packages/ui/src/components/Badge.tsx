import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-gray-700 text-white',
    success: 'bg-green-700 text-white',
    danger: 'bg-red-700 text-white',
    warning: 'bg-yellow-600 text-gray-900',
    info: 'bg-blue-700 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 border-2 border-current font-bold text-sm ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
