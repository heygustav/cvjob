
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CoverLetter from './pages/CoverLetter';
import NotFound from './pages/NotFound';
import { AuthProvider } from './components/AuthProvider';
import AuthCallback from './components/auth/AuthCallback';

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (id: string) => {
    setUserId(id);
    localStorage.setItem('userId', id);
    navigate('/dashboard');
  };

  const handleSignup = (id: string) => {
    setUserId(id);
    localStorage.setItem('userId', id);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            userId ? (
              <Dashboard userId={userId} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/cover-letter/:id?"
          element={
            userId ? (
              <CoverLetter userId={userId} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
