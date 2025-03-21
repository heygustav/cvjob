import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthLogic = (
  isLoading: boolean,
  attemptCount: number,
  redirectUrl: string | null,
  resetAttemptCount: () => void,
  setAttemptCount: (count: number) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      
      // Add this to debug authentication issues
      const authState = await supabase.auth.getSession();
      console.log("Current auth state before signing in:", authState);
      
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
            title: "Login fejlede",
            description: "Der opstod en fejl med verifikation. Prøv igen om et øjeblik.",
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

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    try {
      console.log("Attempting to sign up with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
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

  const signOut = useCallback(async () => {
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        
        toast({
          title: "Log ud fejlede",
          description: error.message,
          variant: "destructive",
        });
        
        throw error;
      }
      
      console.log("Sign out successful");
      resetAttemptCount();
      
      toast({
        title: "Log ud",
        description: "Du er nu logget ud",
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      
      toast({
        title: "Log ud fejlede",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved log ud",
        variant: "destructive",
      });
    }
  }, [navigate, resetAttemptCount, toast]);

  const handleAuthentication = useCallback(
    async (email: string, password: string, isSignUp: boolean, name?: string) => {
      if (isLoading) {
        console.log("Authentication in progress, please wait");
        toast({
          title: "Vent venligst",
          description: "Behandler din anmodning...",
        });
        return;
      }
      
      try {
        console.log(`Handling ${isSignUp ? 'sign up' : 'sign in'}`);
        
        if (isSignUp) {
          await signUp(email, password, name);
        } else {
          await signIn(email, password);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Toast messages are shown in signIn and signUp functions
        throw error; // Re-throw to let the calling component handle it
      }
    },
    [isLoading, signIn, signUp, toast]
  );

  return {
    signIn,
    signUp,
    signOut,
    handleAuthentication,
  };
};
