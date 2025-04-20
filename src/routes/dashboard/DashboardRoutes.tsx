
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CompanyForm = lazy(() => import('@/pages/CompanyForm'));

export const dashboardRoutes = [
  <Route 
    key="dashboard"
    path="/dashboard" 
    element={
      <RouteWrapper protected>
        <Dashboard />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="company-new"
    path="/company/new" 
    element={
      <RouteWrapper protected>
        <CompanyForm />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="company-edit"
    path="/company/:id/edit" 
    element={
      <RouteWrapper protected>
        <CompanyForm />
      </RouteWrapper>
    } 
  />
];

// Add a default export that returns the routes array
export default function DashboardRoutes() {
  return dashboardRoutes;
}
