
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createAppError, showErrorToast } from '@/utils/errorHandling';
import { sanitizeInput, validateAndSanitizeUrl } from '@/utils/security';

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
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      
      console.log("Attempting to sign in with email:", sanitizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        
        // Prepare a properly typed error with specific messages
        let authError;
        
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          authError = createAppError(
            "Email eller adgangskode er forkert. Prøv igen eller opret en ny konto.",
            'auth-error',
            true
          );
        } else if (error.message.includes('Email not confirmed')) {
          authError = createAppError(
            "Bekræft venligst din email før du logger ind.",
            'auth-error',
            true
          );
        } else if (error.message.includes('captcha verification')) {
          authError = createAppError(
            "Du skal åbne siden i en browser og ikke i en indlejret visning for at logge ind. Prøv at rydde cookies og cache.",
            'auth-error',
            true
          );
        } else {
          authError = createAppError(
            error.message,
            'auth-error',
            true
          );
        }
        
        // Use our standard error toast
        showErrorToast(authError);
        throw authError;
      }
      
      console.log("Sign in successful, redirectUrl:", redirectUrl);
      
      toast({
        title: "Login succesfuldt",
        description: "Du er nu logget ind",
      });
      
      // Validate and sanitize the redirect URL
      const safeRedirectUrl = validateAndSanitizeUrl(redirectUrl);
      
      if (safeRedirectUrl) {
        navigate(safeRedirectUrl);
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
