
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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { session } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login onLogin={() => {}} />} />
      <Route path="/signup" element={<Signup onSignup={() => {}} />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cover-letter/:id?" 
        element={
          <ProtectedRoute>
            <CoverLetter userId={session?.user?.id || ''} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ansoegning" 
        element={
          <ProtectedRoute>
            <CoverLetterGenerator />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cover-letter/generator" 
        element={
          <ProtectedRoute>
            <CoverLetterGenerator />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
