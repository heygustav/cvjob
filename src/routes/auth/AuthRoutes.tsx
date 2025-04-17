
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import AuthCallback from '@/components/auth/AuthCallback';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';

const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Auth = lazy(() => import('@/pages/Auth'));

export const authRoutes = [
  <Route 
    key="login"
    path="/login" 
    element={
      <RouteWrapper>
        <Login onLogin={() => {}} />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="signup"
    path="/signup" 
    element={
      <RouteWrapper>
        <Signup onSignup={() => {}} />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="auth"
    path="/auth" 
    element={
      <RouteWrapper>
        <Auth />
      </RouteWrapper>
    } 
  />,
  <Route key="auth-callback" path="/auth/callback" element={<AuthCallback />} />
];
