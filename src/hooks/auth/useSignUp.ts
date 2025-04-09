
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface SignUpOptions {
  attemptCount: number;
  redirectUrl: string | null;
  setAttemptCount: (count: number) => void;
}

export const useSignUp = (options: SignUpOptions) => {
  const { attemptCount, redirectUrl, setAttemptCount } = options;
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    try {
      console.log("Attempting to sign up with email:", email);
      
      // For signup, we're using the standard flow which may require captcha
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            gdpr_accepted: true,
            gdpr_acceptance_date: new Date().toISOString(),
          },
          // The captcha will be automatically handled by Supabase when required
        },
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        
        // Handle specific error messages
        if (error.message.includes('already registered')) {
          toast({
            title: "Oprettelse fejlede",
            description: "Denne email er allerede i brug. Prøv at logge ind i stedet.",
            variant: "destructive",
          });
        } else if (error.message.includes('captcha verification')) {
          toast({
            title: "Captcha fejlede",
            description: "Captcha verifikation fejlede. Prøv venligst igen.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Oprettelse fejlede",
            description: error.message,
            variant: "destructive",
          });
        }
        
        throw error;
      }
      
      console.log("Sign up successful");
      
      if (data?.user && !data.session) {
        toast({
          title: "Bekræft din email",
          description: "Vi har sendt dig en email med et link til at bekræfte din konto.",
        });
      } else {
        toast({
          title: "Konto oprettet",
          description: "Din konto er nu oprettet, og du er logget ind",
        });
        
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate('/profile');
        }
      }
      
      return { error: null, data };
    } catch (error) {
      console.error("Sign up error:", error);
      
      setAttemptCount(attemptCount + 1);
      
      return {
        error: error instanceof Error ? error : new Error("Unknown error"),
        data: null,
      };
    }
  }, [attemptCount, navigate, redirectUrl, setAttemptCount, toast]);

  return signUp;
};
