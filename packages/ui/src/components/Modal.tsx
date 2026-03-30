import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-gray-900 border-4 border-yellow-400 p-6 max-w-md w-full mx-4 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-2xl font-bold text-yellow-400">{title}</h2>}
          <button
            onClick={onClose}
            className="text-2xl text-yellow-400 hover:text-yellow-500 font-bold"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </div>
  );
};

Modal.displayName = 'Modal';
