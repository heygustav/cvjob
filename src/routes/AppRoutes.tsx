
import React, { lazy, Suspense, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from './MainLayout';

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
        <MainLayout>
          <Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <Index />
          </Suspense>
        </MainLayout>
      } />

      <Route path="/gdpr-info" element={
        <MainLayout>
          <Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <GDPRInfoPage />
          </Suspense>
        </MainLayout>
      } />

      {/* Feature-specific routes */}
      {authRoutes}
      {dashboardRoutes}
      {generatorRoutes}
      {profileRoutes}

      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <MainLayout>
          <Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <NotFound />
          </Suspense>
        </MainLayout>
      } />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes;
