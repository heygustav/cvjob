import React, { lazy, Suspense, memo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import AuthCallback from './components/auth/AuthCallback';
import Navbar from './components/navbar/Navbar';
import BackToTop from './components/BackToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useToast } from './hooks/use-toast';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

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
const DanishResume = lazy(() => import('./pages/DanishResume'));
const CompanyForm = lazy(() => import('./pages/CompanyForm'));
const BrainstormPage = lazy(() => import('./pages/BrainstormPage'));

// Fallback loading component for lazy loading
const PageLoadingFallback = () => (
  <div className="w-full flex justify-center items-center py-24">
    <LoadingSpinner message="Indlæser side..." />
  </div>
);

// Layout component that includes the Navbar
const MainLayout = memo(({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show welcome toast on homepage
  useEffect(() => {
    if (location.pathname === '/' && !sessionStorage.getItem('welcomed')) {
      toast({
        title: "Velkommen til CVjob",
        description: "Scroll ned for at se vores funktioner og hvordan du kommer i gang.",
      });
      sessionStorage.setItem('welcomed', 'true');
    }
  }, [location.pathname, toast]);

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
