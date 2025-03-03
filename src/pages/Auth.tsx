
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/auth/AuthLayout';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const { signIn, signUp, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored redirect URL on mount
  useEffect(() => {
    const storedRedirect = localStorage.getItem('redirectAfterLogin');
    if (storedRedirect) {
      // Sanitize the URL to prevent open redirect vulnerabilities
      const sanitizedUrl = DOMPurify.sanitize(storedRedirect);
      // Only accept internal URLs
      if (sanitizedUrl.startsWith('/') && !sanitizedUrl.includes('://')) {
        setRedirectUrl(sanitizedUrl);
        console.log("Auth: Found redirectUrl:", sanitizedUrl);
      } else {
        console.error("Invalid redirect URL detected and blocked:", storedRedirect);
      }
    }
  }, []);

  useEffect(() => {
    if (session) {
      // Redirect to stored URL if available, otherwise to dashboard
      if (redirectUrl) {
        console.log("Auth: Redirecting to:", redirectUrl);
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, navigate, redirectUrl]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuthentication = async (email: string, password: string) => {
    // Rate limiting to prevent brute force attacks
    if (attemptCount > 5) {
      toast({
        title: 'For mange forsøg',
        description: 'Du har foretaget for mange login-forsøg. Prøv igen senere.',
        variant: 'destructive',
      });
      return;
    }
    
    // Increment attempt counter
    setAttemptCount(prev => prev + 1);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        toast({
          title: 'Konto oprettet',
          description: 'Din konto er oprettet. Tjek din e-mail for bekræftelse.',
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: 'Logget ind',
          description: 'Du er nu logget ind',
        });
        
        // Reset attempt counter on successful login
        setAttemptCount(0);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'Der opstod en fejl. Prøv igen senere.';
      
      if (error.message) {
        if (error.message.includes('Invalid login')) {
          errorMessage = 'Forkert e-mail eller adgangskode';
        } else if (error.message.includes('already registered')) {
          errorMessage = 'Denne e-mail er allerede registreret';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'For mange forsøg. Prøv igen senere.';
        } else {
          // Generic error message to avoid leaking implementation details
          errorMessage = 'Autentificering mislykkedes. Kontrollér dine oplysninger og prøv igen.';
        }
      }
      
      toast({
        title: 'Fejl',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const pageTitle = isSignUp ? 'Opret konto' : 'Log ind på din konto';

  return (
    <AuthLayout title={pageTitle} redirectUrl={redirectUrl}>
      <AuthForm
        isSignUp={isSignUp}
        onSubmit={handleAuthentication}
        isLoading={isLoading}
        attemptCount={attemptCount}
        toggleMode={toggleMode}
      />
    </AuthLayout>
  );
};

export default Auth;
