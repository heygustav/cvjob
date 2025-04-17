
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';

const CoverLetter = lazy(() => import('@/pages/CoverLetter'));
const CoverLetterGenerator = lazy(() => import('@/pages/CoverLetterGenerator'));

export const generatorRoutes = [
  <Route 
    key="cover-letter"
    path="/cover-letter/:id?" 
    element={
      <RouteWrapper protected>
        <CoverLetter userId={''} />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="generator"
    path="/ansoegning" 
    element={
      <RouteWrapper protected>
        <CoverLetterGenerator />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="generator-alt"
    path="/cover-letter/generator" 
    element={
      <RouteWrapper protected>
        <CoverLetterGenerator />
      </RouteWrapper>
    } 
  />
];
