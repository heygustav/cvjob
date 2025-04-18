
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load heavy components
const CoverLetter = lazy(() => import('@/pages/CoverLetter'));
const CoverLetterGenerator = lazy(() => import('@/pages/CoverLetterGenerator'));

// Custom loading component for generator
const GeneratorLoader = () => (
  <div className="min-h-[600px] flex items-center justify-center">
    <LoadingSpinner message="Forbereder generator..." />
  </div>
);

export const generatorRoutes = [
  <Route 
    key="cover-letter"
    path="/cover-letter/:id?" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<GeneratorLoader />}>
          <CoverLetter userId={''} />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="generator"
    path="/ansoegning" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<GeneratorLoader />}>
          <CoverLetterGenerator />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="generator-alt"
    path="/cover-letter/generator" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<GeneratorLoader />}>
          <CoverLetterGenerator />
        </React.Suspense>
      </RouteWrapper>
    } 
  />
];
