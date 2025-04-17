
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import RouteWrapper from '@/components/route-wrapper/RouteWrapper';

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
      <RouteWrapper protected>
        <Profile />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="profile-quiz"
    path="/profile-quiz" 
    element={
      <RouteWrapper>
        <ProfileQuiz />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="resume"
    path="/resume" 
    element={
      <RouteWrapper protected>
        <Resume />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="resume-dk"
    path="/resume/dk" 
    element={
      <RouteWrapper protected>
        <DanishResume />
      </RouteWrapper>
    } 
  />,
  <Route 
    key="brainstorm"
    path="/brainstorm" 
    element={
      <RouteWrapper protected>
        <BrainstormPage />
      </RouteWrapper>
    } 
  />
];
