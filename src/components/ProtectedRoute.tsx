
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading } = useAuth();
  
  // If auth is still loading, show a spinner
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-24">
        <LoadingSpinner message="Verificerer login..." />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;

