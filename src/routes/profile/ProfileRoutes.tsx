
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MainLayout from '../MainLayout';

const Profile = lazy(() => import('@/pages/Profile'));
const ProfileQuiz = lazy(() => import('@/pages/ProfileQuiz'));
const Resume = lazy(() => import('@/pages/Resume'));
const DanishResume = lazy(() => import('@/pages/DanishResume'));
const BrainstormPage = lazy(() => import('@/pages/BrainstormPage'));

export const profileRoutes = [
  <Route 
    key="profile"
    path="/profile" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <Profile />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="profile-quiz"
    path="/profile-quiz" 
    element={
      <MainLayout>
        <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
          <ProfileQuiz />
        </React.Suspense>
      </MainLayout>
    } 
  />,
  <Route 
    key="resume"
    path="/resume" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <Resume />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="resume-dk"
    path="/resume/dk" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <DanishResume />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="brainstorm"
    path="/brainstorm" 
    element={
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<LoadingSpinner message="Indlæser side..." />}>
            <BrainstormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    } 
  />
];
