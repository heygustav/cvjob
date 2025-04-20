
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load components
const Profile = lazy(() => import('@/pages/Profile'));
const ProfileQuiz = lazy(() => import('@/pages/ProfileQuiz'));
const Resume = lazy(() => import('@/pages/Resume'));
const DanishResume = lazy(() => import('@/pages/DanishResume'));
const BrainstormPage = lazy(() => import('@/pages/BrainstormPage'));

// Custom loading component for profile/resume sections
const ResumeLoader = () => (
  <div className="min-h-[600px] flex items-center justify-center">
    <LoadingSpinner message="Forbereder CV-builder..." />
  </div>
);

export const profileRoutes = [
  <Route 
    key="profile"
    path="/profile" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<ResumeLoader />}>
          <Profile />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="profile-quiz"
    path="/profile-quiz" 
    element={
      <RouteWrapper>
        <React.Suspense fallback={<ResumeLoader />}>
          <ProfileQuiz />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="resume"
    path="/resume" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<ResumeLoader />}>
          <Resume />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="resume-dk"
    path="/resume/dk" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<ResumeLoader />}>
          <DanishResume />
        </React.Suspense>
      </RouteWrapper>
    } 
  />,
  <Route 
    key="brainstorm"
    path="/brainstorm" 
    element={
      <RouteWrapper protected>
        <React.Suspense fallback={<ResumeLoader />}>
          <BrainstormPage />
        </React.Suspense>
      </RouteWrapper>
    } 
  />
];

// Add a default export that returns the routes array
export default function ProfileRoutes() {
  return profileRoutes;
}
