import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CoverLetter from './pages/CoverLetter';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './components/AuthProvider';
import AuthCallback from './components/auth/AuthCallback';
import Profile from './pages/Profile';
import ProfileQuiz from './pages/ProfileQuiz';
import Resume from './pages/Resume';
import Navbar from './components/navbar/Navbar';
import BackToTop from './components/BackToTop';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout component that includes the Navbar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <BackToTop threshold={300} showLabel />
    </>
  );
};

const AppRoutes = () => {
  const { session } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Index /></MainLayout>} />
      <Route path="/login" element={<Login onLogin={() => {}} />} />
      <Route path="/signup" element={<Signup onSignup={() => {}} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/profile-quiz" element={<ProfileQuiz />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cover-letter/:id?" 
        element={
          <ProtectedRoute>
            <MainLayout><CoverLetter userId={session?.user?.id || ''} /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ansoegning" 
        element={
          <ProtectedRoute>
            <MainLayout><CoverLetterGenerator /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cover-letter/generator" 
        element={
          <ProtectedRoute>
            <MainLayout><CoverLetterGenerator /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resume" 
        element={
          <ProtectedRoute>
            <MainLayout><Resume /></MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
