import React, { lazy, Suspense, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import AuthCallback from './components/auth/AuthCallback';
import Navbar from './components/navbar/Navbar';
import BackToTop from './components/BackToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages for better initial load performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoverLetter = lazy(() => import('./pages/CoverLetter'));
const CoverLetterGenerator = lazy(() => import('./pages/CoverLetterGenerator'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileQuiz = lazy(() => import('./pages/ProfileQuiz'));
const Resume = lazy(() => import('./pages/Resume'));

// Fallback loading component for lazy loading
const PageLoadingFallback = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <LoadingSpinner message="Indlæser side..." />
  </div>
);

// Protected route component
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

// Layout component that includes the Navbar
const MainLayout = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-[calc(100vh-4rem)]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <BackToTop threshold={300} showLabel />
    </>
  );
});

MainLayout.displayName = 'MainLayout';

const AppRoutes = memo(() => {
  const { session } = useAuth();
  
  return (
    <Routes>
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
      
      {/* Protected Routes */}
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

const App = memo(() => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
});

App.displayName = 'App';

export default App;
