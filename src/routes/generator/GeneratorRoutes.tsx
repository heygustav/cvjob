
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from '../MainLayout';

const CoverLetter = lazy(() => import('@/pages/CoverLetter'));
const CoverLetterGenerator = lazy(() => import('@/pages/CoverLetterGenerator'));

export const generatorRoutes = [
  <Route 
    key="cover-letter"
    path="/cover-letter/:id?" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <CoverLetter userId={''} />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="generator"
    path="/ansoegning" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <CoverLetterGenerator />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="generator-alt"
    path="/cover-letter/generator" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <CoverLetterGenerator />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />
];
