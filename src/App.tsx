
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import JobForm from "./pages/JobForm";
import { AuthProvider } from "./components/AuthProvider";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import Auth from "./pages/Auth";
import React from 'react';

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

function App() {
  // Handler for login/signup that can be passed to components
  const handleUserAuth = (userId: string) => {
    console.log("User authenticated:", userId);
    // This function would typically set the user's auth state
    // But that's likely handled in AuthProvider now
  };

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login onLogin={handleUserAuth} />} />
            <Route path="/signup" element={<Signup onSignup={handleUserAuth} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job/new" element={<JobForm />} />
            <Route path="/job/:id" element={<JobForm />} />
            <Route path="/cover-letter" element={<CoverLetterGenerator />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
