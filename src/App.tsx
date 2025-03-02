
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";
import { AuthProvider, useAuth } from './components/AuthProvider';
import Dashboard from './pages/Dashboard';
import Home from './pages/Index'; 
import CoverLetter from './pages/CoverLetterGenerator';
import Profile from './pages/Profile';
import JobForm from './pages/JobForm';
import Contact from './pages/Contact';
import About from './pages/AboutUs';
import Terms from './pages/TermsAndConditions';
import Privacy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import JobEdit from './pages/JobEdit';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/cover-letter" element={
            <ProtectedRoute>
              <CoverLetter />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/job/new" element={
            <ProtectedRoute>
              <JobForm />
            </ProtectedRoute>
          } />
          <Route path="/job/edit/:jobId" element={
            <ProtectedRoute>
              <JobEdit />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
