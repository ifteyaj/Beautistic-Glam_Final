import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClasses[size]} border-stone-200 border-t-brand rounded-full animate-spin`} />
    </div>
  );
};

export const LoadingPage: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-stone-500 text-sm uppercase tracking-widest">{message}</p>
    </div>
  </div>
);
