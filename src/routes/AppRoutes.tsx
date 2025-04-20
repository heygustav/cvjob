
import React, { lazy, memo, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Import route components directly
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const GDPRInfoPage = lazy(() => import('@/pages/GDPRInfoPage'));

// Import route groups
import AuthRoutes from './auth/AuthRoutes';
import DashboardRoutes from './dashboard/DashboardRoutes';
import GeneratorRoutes from './generator/GeneratorRoutes';
import ProfileRoutes from './profile/ProfileRoutes';

// Custom loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner message="Indlæser side..." />
  </div>
);

const AppRoutes = memo(() => {
  // Get route arrays from their respective modules
  const authRouteElements = AuthRoutes();
  const dashboardRouteElements = DashboardRoutes();
  const generatorRouteElements = GeneratorRoutes();
  const profileRouteElements = ProfileRoutes();

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

      {/* Feature-specific routes with code splitting */}
      <Suspense fallback={<PageLoader />}>
        {/* Render route arrays */}
        {authRouteElements}
        {dashboardRouteElements}
        {generatorRouteElements}
        {profileRouteElements}
      </Suspense>

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
