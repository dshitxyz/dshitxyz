import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-yellow-400 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-gray-800 border-2 border-yellow-400 text-white font-mono focus:outline-none focus:border-yellow-500 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1 font-mono">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-400 text-sm mt-1 font-mono">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
