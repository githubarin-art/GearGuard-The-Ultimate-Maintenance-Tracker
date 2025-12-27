import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, PERMISSIONS } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and optionally specific roles.
 * - If not authenticated → redirects to /login
 * - If authenticated but wrong role → redirects to /unauthorized or home
 * - If authenticated with correct role → renders children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasPermission(requiredRoles)) {
      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * MemberRoute - Routes accessible by team members (and admins)
 */
export const MemberRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requiredRoles={['admin', 'member']}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
