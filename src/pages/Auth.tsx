
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/components/AuthProvider';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    redirectUrl, 
    isLoading,
    isAuthenticated,
    attemptCount,
    handleAuthentication,
    setRedirectUrl
  } = useAuth();

  // Extract redirect parameter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    
    if (redirectParam) {
      // Store the redirect URL for after authentication
      localStorage.setItem('redirectAfterLogin', redirectParam);
      setRedirectUrl(redirectParam);
    }
  }, [location, setRedirectUrl]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (email: string, password: string) => {
    await handleAuthentication(email, password, isSignUp);
  };

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
      <AuthForm
        isSignUp={isSignUp}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        attemptCount={attemptCount}
        toggleMode={toggleMode}
      />
    </AuthLayout>
  );
};

export default Auth;
