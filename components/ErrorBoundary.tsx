import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  if (fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
