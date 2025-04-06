
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-[70vh]">Loading...</div>;
  }

  if (!user) {
    // Save the current location so we can redirect back after login
    return <Navigate to="/auth" state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
