
import React, { lazy, Suspense, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import AuthCallback from '../components/auth/AuthCallback';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import MainLayout from './MainLayout';

// Page loading fallback
const PageLoadingFallback = () => (
  <div className="w-full flex justify-center items-center py-24">
    <LoadingSpinner message="Indlæser side..." />
  </div>
);

// Lazy load pages for better initial load performance
const Index = lazy(() => import('../pages/Index'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Auth = lazy(() => import('../pages/Auth'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CoverLetter = lazy(() => import('../pages/CoverLetter'));
const CoverLetterGenerator = lazy(() => import('../pages/CoverLetterGenerator'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Profile = lazy(() => import('../pages/Profile'));
const ProfileQuiz = lazy(() => import('../pages/ProfileQuiz'));
const Resume = lazy(() => import('../pages/Resume'));
const DanishResume = lazy(() => import('../pages/DanishResume'));
const CompanyForm = lazy(() => import('../pages/CompanyForm'));
const BrainstormPage = lazy(() => import('../pages/BrainstormPage'));
const GDPRInfoPage = lazy(() => import('../pages/GDPRInfoPage'));

const AppRoutes = memo(() => {
  const { session } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <MainLayout>
          <Suspense fallback={<PageLoadingFallback />}>
            <Index />
          </Suspense>
        </MainLayout>
      } />
      
      <Route path="/login" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <Login onLogin={() => {}} />
        </Suspense>
      } />
      
      <Route path="/signup" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <Signup onSignup={() => {}} />
        </Suspense>
      } />
      
      <Route path="/auth" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <Auth />
        </Suspense>
      } />
      
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route path="/profile-quiz" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <ProfileQuiz />
        </Suspense>
      } />
      
      <Route path="/gdpr-info" element={
        <MainLayout>
          <Suspense fallback={<PageLoadingFallback />}>
            <GDPRInfoPage />
          </Suspense>
        </MainLayout>
      } />
      
      {/* Protected routes that require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <Dashboard />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/company/new" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <CompanyForm />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/company/:id/edit" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <CompanyForm />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cover-letter/:id?" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <CoverLetter userId={session?.user?.id || ''} />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ansoegning" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <CoverLetterGenerator />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cover-letter/generator" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <CoverLetterGenerator />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <Profile />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/resume" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <Resume />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/resume/dk" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <DanishResume />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/brainstorm" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoadingFallback />}>
                <BrainstormPage />
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <MainLayout>
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFound />
          </Suspense>
        </MainLayout>
      } />
    </Routes>
  );
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes;
