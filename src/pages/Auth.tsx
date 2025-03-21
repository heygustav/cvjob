
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import ErrorDisplay from '@/components/ErrorDisplay';
import { AlertTriangle } from 'lucide-react';

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
      console.log("User is authenticated, redirecting to:", redirectUrl || '/dashboard');
      
      // Show success toast when authenticated
      toast({
        title: "Logget ind",
        description: "Du er nu logget ind",
        variant: "default",
      });
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, redirectUrl, toast]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null); // Clear any errors when switching modes
  };

  const handleSubmit = async (email: string, password: string) => {
    setError(null); // Clear previous errors
    console.log("Auth page: handling submit with", email);
    
    try {
      // Add a clearer log to see if this function is being called
      console.log("Auth page: attempting authentication with mode:", isSignUp ? "sign-up" : "sign-in");
      await handleAuthentication(email, password, isSignUp);
      console.log("Auth page: authentication completed successfully");
    } catch (err) {
      console.error("Auth page: authentication error:", err);
      // This will mostly be handled in authLogic.ts, but we'll add a fallback here
      const errorMessage = err instanceof Error ? err.message : 'Der opstod en uventet fejl';
      setError(errorMessage);
      
      // Error handling moved to authLogic.ts to centralize error handling
      // Only display a generic error for any edge cases that weren't caught
      if (!errorMessage.includes('Invalid login credentials') && 
          !errorMessage.includes('Invalid email') && 
          !errorMessage.includes('captcha verification')) {
        toast({
          title: "Fejl ved godkendelse",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <div role="main" aria-labelledby="auth-title">
      <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
        {error && (
          <div className="mb-4" aria-live="assertive">
            <ErrorDisplay 
              title={isSignUp ? "Kunne ikke oprette konto" : "Kunne ikke logge ind"} 
              message={error}
              phase="user-fetch"
              icon={<AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />}
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
        
        {attemptCount > 3 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md" aria-live="polite">
            <p className="text-sm text-amber-800">
              Har du problemer med at logge ind? Prøv at rydde cookies og cache eller kontakt support.
            </p>
          </div>
        )}
      </AuthLayout>
    </div>
  );
};

export default Auth;
