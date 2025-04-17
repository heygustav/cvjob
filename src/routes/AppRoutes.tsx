
import React, { lazy, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';

// Import route groups
import { authRoutes } from './auth/AuthRoutes';
import { dashboardRoutes } from './dashboard/DashboardRoutes';
import { generatorRoutes } from './generator/GeneratorRoutes';
import { profileRoutes } from './profile/ProfileRoutes';

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const GDPRInfoPage = lazy(() => import('@/pages/GDPRInfoPage'));

const AppRoutes = memo(() => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <RouteWrapper>
          <Index />
        </RouteWrapper>
      } />

      <Route path="/gdpr-info" element={
        <RouteWrapper>
          <GDPRInfoPage />
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
          <NotFound />
        </RouteWrapper>
      } />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes;
