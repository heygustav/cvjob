
import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from '@/routes/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface RouteWrapperProps {
  children: React.ReactNode;
  protected?: boolean;
  loadingMessage?: string;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({
  children,
  protected: isProtected = false,
  loadingMessage = "Indlæser side..."
}) => {
  const wrappedContent = (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        {children}
      </Suspense>
    </MainLayout>
  );

  if (isProtected) {
    return <ProtectedRoute>{wrappedContent}</ProtectedRoute>;
  }

  return wrappedContent;
};

export default RouteWrapper;
