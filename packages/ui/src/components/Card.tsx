import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-gray-900 border-4 border-yellow-400 p-6 box-shadow-lg ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
