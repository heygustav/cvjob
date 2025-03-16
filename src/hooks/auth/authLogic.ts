
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthActions } from './types';

export const useAuthLogic = (
  isLoading: boolean, 
  attemptCount: number, 
  redirectUrl: string | null, 
  resetAttemptCount: () => void, 
  setAttemptCount: (updater: (prev: number) => number) => void
): Pick<AuthActions, 'signIn' | 'signUp' | 'signOut' | 'handleAuthentication'> => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    // If we have a name, add it as metadata
    const options = name ? { data: { name } } : undefined;
    return await supabase.auth.signUp({ email, password, options });
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  // Handle authentication (sign in or sign up)
  const handleAuthentication = useCallback(async (
    email: string, 
    password: string, 
    isSignUp: boolean, 
    name?: string
  ) => {
    // Rate limiting to prevent brute force attacks
    if (attemptCount > 5) {
      toast({
        title: 'For mange forsøg',
        description: 'Du har foretaget for mange login-forsøg. Prøv igen senere.',
        variant: 'destructive',
      });
      return;
    }
    
    // Use functional update to prevent stale state issues
    setAttemptCount(prev => prev + 1);

    try {
      if (isSignUp) {
        const { error, data } = await signUp(email, password, name);
        if (error) throw error;
        
        if (data?.user?.identities?.length === 0) {
          toast({
            title: 'Konto findes allerede',
            description: 'Denne e-mail er allerede registreret. Prøv at logge ind i stedet.',
            variant: 'destructive',
          });
          return;
        }
        
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
  }, [attemptCount, navigate, redirectUrl, resetAttemptCount, signIn, signUp, toast, setAttemptCount]);

  return {
    signIn,
    signUp,
    signOut,
    handleAuthentication
  };
};
