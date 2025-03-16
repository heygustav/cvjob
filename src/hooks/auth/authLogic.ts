
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      console.log("Sign in successful, redirectUrl:", redirectUrl);
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
      
      return { error: null, data };
    } catch (error) {
      console.error("Sign in error:", error);
      
      toast({
        title: "Login fejlede",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved login",
        variant: "destructive",
      });
      
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
        throw error;
      }
      
      console.log("Sign up successful");
      
      if (data?.user && !data.session) {
        toast({
          title: "Bekræft din email",
          description: "Vi har sendt dig en email med et link til at bekræfte din konto.",
        });
      } else if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/profile');
      }
      
      return { error: null, data };
    } catch (error) {
      console.error("Sign up error:", error);
      
      toast({
        title: "Oprettelse fejlede",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved oprettelse af konto",
        variant: "destructive",
      });
      
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
        throw error;
      }
      
      console.log("Sign out successful");
      resetAttemptCount();
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
        
        toast({
          title: `${isSignUp ? 'Oprettelse' : 'Login'} fejlede`,
          description: error instanceof Error ? error.message : `Der opstod en fejl ved ${isSignUp ? 'oprettelse af konto' : 'login'}`,
          variant: "destructive",
        });
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
