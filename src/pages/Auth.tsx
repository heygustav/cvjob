
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { ErrorDisplay } from '@/components/ErrorDisplay';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    setError(null); // Clear any errors when switching modes
  };

  const handleSubmit = async (email: string, password: string) => {
    setError(null); // Clear previous errors
    
    try {
      await handleAuthentication(email, password, isSignUp);
    } catch (err) {
      // This will mostly be handled in authLogic.ts, but we'll add a fallback here
      const errorMessage = err instanceof Error ? err.message : 'Der opstod en uventet fejl';
      setError(errorMessage);
      
      // Show user-friendly error for non-existent user
      if (errorMessage.includes('Invalid login credentials') || 
          errorMessage.includes('Invalid email or password')) {
        toast({
          title: isSignUp ? "Oprettelse fejlede" : "Login fejlede",
          description: isSignUp 
            ? "Denne email er muligvis allerede i brug" 
            : "Email eller adgangskode er forkert. Prøv igen eller opret en ny konto.",
          variant: "destructive",
        });
      }
    }
  };

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
      {error && (
        <div className="mb-4">
          <ErrorDisplay 
            title={isSignUp ? "Kunne ikke oprette konto" : "Kunne ikke logge ind"} 
            message={error}
            phase="user-fetch"
          />
        </div>
      )}
      
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
