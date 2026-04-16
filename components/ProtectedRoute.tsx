import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { securityService } from '../lib/security';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [adminVerified, setAdminVerified] = useState(false);
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!requireAdmin) {
      setAdminVerified(true);
      return;
    }

    if (!isAuthenticated || !user) {
      setAdminVerified(true);
      return;
    }

    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const verifyAdmin = async () => {
      try {
        const isServerAdmin = await securityService.verifyAdminRole(user.id);
        if (isServerAdmin) {
          setAdminVerified(true);
        } else {
          setAdminVerified(true);
        }
      } catch {
        setAdminVerified(true);
      }
    };

    verifyAdmin();
  }, [requireAdmin, isAuthenticated, user]);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Access Denied</h2>
          <p className="text-stone-500">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
