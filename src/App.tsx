import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, BrowserRouter, Navigate, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider, useAuth } from "./components/AuthProvider";

// Eagerly load critical routes
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";

// Lazy load non-critical routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const JobForm = lazy(() => import("./pages/JobForm"));
const CoverLetterGenerator = lazy(() => import("./pages/CoverLetterGenerator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for routes
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen p-8">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the path they were trying to access
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return <RouteLoading />;
  }

  return isAuthenticated ? <>{children}</> : <RouteLoading />;
};

// Simple error boundary component
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Noget gik galt</h1>
          <p className="mb-4">Der opstod en fejl ved indlæsning af applikationen.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => window.location.href = '/'}
          >
            Gå til forsiden
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Main App component
function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Eagerly loaded routes - public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login onLogin={() => {}} />} />
            <Route path="/signup" element={<Signup onSignup={() => {}} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/om-os" element={
              <Suspense fallback={<RouteLoading />}>
                <AboutUs />
              </Suspense>
            } />
            <Route path="/kontakt" element={
              <Suspense fallback={<RouteLoading />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/privatlivspolitik" element={
              <Suspense fallback={<RouteLoading />}>
                <PrivacyPolicy />
              </Suspense>
            } />
            <Route path="/vilkaar-og-betingelser" element={
              <Suspense fallback={<RouteLoading />}>
                <TermsAndConditions />
              </Suspense>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/job/new" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/job/:id" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/ansoegning" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <CoverLetterGenerator />
                </ProtectedRoute>
              </Suspense>
            } />
            
            {/* Add redirects for any old paths */}
            <Route path="/about-us" element={<Navigate to="/om-os" replace />} />
            <Route path="/privacy-policy" element={<Navigate to="/privatlivspolitik" replace />} />
            <Route path="/terms-and-conditions" element={<Navigate to="/vilkaar-og-betingelser" replace />} />
            <Route path="/contact" element={<Navigate to="/kontakt" replace />} />
            <Route path="/generator" element={<Navigate to="/ansoegning" replace />} />
            <Route path="/cover-letter" element={<Navigate to="/ansoegning" replace />} />
            <Route path="/cover-letter/generator" element={<Navigate to="/ansoegning" replace />} />
            
            {/* Cover letter editor route */}
            <Route path="/cover-letter/:id" element={
              <Suspense fallback={<RouteLoading />}>
                <ProtectedRoute>
                  <CoverLetterGenerator />
                </ProtectedRoute>
              </Suspense>
            } />
            
            <Route path="*" element={
              <Suspense fallback={<RouteLoading />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
