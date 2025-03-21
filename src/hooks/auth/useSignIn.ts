
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface SignInOptions {
  isLoading: boolean;
  attemptCount: number;
  redirectUrl: string | null;
  setAttemptCount: (count: number) => void;
}

export const useSignIn = (options: SignInOptions) => {
  const { isLoading, attemptCount, redirectUrl, setAttemptCount } = options;
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      
      // Do NOT call signOut here as it can interfere with the authentication flow
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        
        // Show specific error message depending on the error type
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login fejlede",
            description: "Email eller adgangskode er forkert. Prøv igen eller opret en ny konto.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email ikke bekræftet",
            description: "Bekræft venligst din email før du logger ind.",
            variant: "destructive",
          });
        } else if (error.message.includes('captcha verification')) {
          toast({
            title: "CAPTCHA fejlede",
            description: "Du skal åbne siden i en browser og ikke i en indlejret visning for at logge ind. Prøv at rydde cookies og cache.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login fejlede",
            description: error.message,
            variant: "destructive",
          });
        }
        
        throw error;
      }
      
      console.log("Sign in successful, redirectUrl:", redirectUrl);
      
      toast({
        title: "Login succesfuldt",
        description: "Du er nu logget ind",
      });
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
      
      return { error: null, data };
    } catch (error) {
      console.error("Sign in error:", error);
      
      setAttemptCount(attemptCount + 1);
      
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
        data: null,
      };
    }
  }, [attemptCount, navigate, redirectUrl, setAttemptCount, toast]);

  return signIn;
};
