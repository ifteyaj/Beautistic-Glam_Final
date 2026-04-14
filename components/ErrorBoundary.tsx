import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

// Simple function-based error boundary
export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // This is a simplified version - for full error boundary functionality
  // would need a class component or external library
  React.useEffect(() => {
    const handleError = (err: ErrorEvent) => {
      console.error('Global error:', err);
      setHasError(true);
      setError(err.error);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-serif text-brand mb-6">Oops!</h1>
          <p className="text-stone-600 mb-8">
            Something went wrong. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors rounded-[5px]"
          >
            Refresh Page
          </button>
          <Link
            to="/"
            className="block mt-4 border border-brand text-brand px-8 py-3 uppercase tracking-widest text-xs hover:bg-brand/5 transition-colors rounded-[5px]"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};