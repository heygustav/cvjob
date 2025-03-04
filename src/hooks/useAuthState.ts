
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectUrl: string | null;
  attemptCount: number;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, name?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  handleAuthentication: (email: string, password: string, isSignUp: boolean, name?: string) => Promise<void>;
  setRedirectUrl: (url: string | null) => void;
  resetAttemptCount: () => void;
}

export const useAuthState = (): [AuthState, AuthActions] => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Computed property for authentication status
  const isAuthenticated = !!session && !!user;

  useEffect(() => {
    // Check for stored redirect URL on mount
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
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // This useEffect handles redirection after login
  useEffect(() => {
    // Only redirect if we have a new session (i.e., just logged in)
    if (session && redirectUrl) {
      console.log("Auth: Redirecting to:", redirectUrl);
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectUrl);
      setRedirectUrl(null); // Clear the redirect URL after use
    }
  }, [session, navigate, redirectUrl]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    // If we have a name, add it as metadata
    const options = name ? { data: { name } } : undefined;
    const result = await supabase.auth.signUp({ email, password, options });
    setIsLoading(false);
    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const resetAttemptCount = () => {
    setAttemptCount(0);
  };

  const handleAuthentication = async (email: string, password: string, isSignUp: boolean, name?: string) => {
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
        const { error } = await signUp(email, password, name);
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
        
        // Set default redirect to dashboard if none specified
        if (!redirectUrl) {
          navigate('/dashboard');
        }
        
        // Reset attempt counter on successful login
        resetAttemptCount();
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

  const state: AuthState = {
    session,
    user,
    isLoading,
    isAuthenticated,
    redirectUrl,
    attemptCount,
  };

  const actions: AuthActions = {
    signIn,
    signUp,
    signOut,
    handleAuthentication,
    setRedirectUrl,
    resetAttemptCount,
  };

  return [state, actions];
};
