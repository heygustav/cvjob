
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from '../MainLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CompanyForm = lazy(() => import('@/pages/CompanyForm'));

export const dashboardRoutes = [
  <Route 
    key="dashboard"
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <Dashboard />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="company-new"
    path="/company/new" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <CompanyForm />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="company-edit"
    path="/company/:id/edit" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <CompanyForm />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />
];
