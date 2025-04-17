
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import AuthCallback from '@/components/auth/AuthCallback';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from '../MainLayout';

const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Auth = lazy(() => import('@/pages/Auth'));

export const authRoutes = [
  <Route 
    key="login"
    path="/login" 
    element={
      <MainLayout>
        <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
          <Login onLogin={() => {}} />
        </React.Suspense>
      </MainLayout>
    } 
  />,
  <Route 
    key="signup"
    path="/signup" 
    element={
      <MainLayout>
        <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
          <Signup onSignup={() => {}} />
        </React.Suspense>
      </MainLayout>
    } 
  />,
  <Route 
    key="auth"
    path="/auth" 
    element={
      <MainLayout>
        <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
          <Auth />
        </React.Suspense>
      </MainLayout>
    } 
  />,
  <Route key="auth-callback" path="/auth/callback" element={<AuthCallback />} />
];
