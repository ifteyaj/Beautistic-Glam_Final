import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}) => {
  return (
    <div className="text-center py-16 bg-stone-50 rounded-[5px]">
      <h3 className="text-2xl font-serif text-stone-900 mb-4">{title}</h3>
      {message && <p className="text-stone-500 mb-8 max-w-md mx-auto">{message}</p>}
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link
            to={actionHref}
            className="inline-block text-xs uppercase tracking-widest border-b border-brand pb-1 text-brand font-bold hover:text-brand-hover transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-block text-xs uppercase tracking-widest border-b border-brand pb-1 text-brand font-bold hover:text-brand-hover transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => (
  <div className="text-center py-16 bg-red-50 rounded-[5px] border border-red-100">
    <h3 className="text-2xl font-serif text-red-900 mb-4">{title}</h3>
    <p className="text-red-600 mb-8 max-w-md mx-auto">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-block bg-brand text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors rounded-[5px]"
      >
        Try Again
      </button>
    )}
  </div>
);
