
import React, { lazy, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Import route groups
import { authRoutes } from './auth/AuthRoutes';
import { dashboardRoutes } from './dashboard/DashboardRoutes';
import { generatorRoutes } from './generator/GeneratorRoutes';
import { profileRoutes } from './profile/ProfileRoutes';

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const GDPRInfoPage = lazy(() => import('@/pages/GDPRInfoPage'));

// Custom loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner message="Indlæser side..." />
  </div>
);

const AppRoutes = memo(() => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <RouteWrapper>
          <React.Suspense fallback={<PageLoader />}>
            <Index />
          </React.Suspense>
        </RouteWrapper>
      } />

      <Route path="/gdpr-info" element={
        <RouteWrapper>
          <React.Suspense fallback={<PageLoader />}>
            <GDPRInfoPage />
          </React.Suspense>
        </RouteWrapper>
      } />

      {/* Feature-specific routes */}
      {authRoutes}
      {dashboardRoutes}
      {generatorRoutes}
      {profileRoutes}

      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <RouteWrapper>
          <React.Suspense fallback={<PageLoader />}>
            <NotFound />
          </React.Suspense>
        </RouteWrapper>
      } />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes;
