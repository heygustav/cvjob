
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface HandleAuthenticationOptions {
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null; data: any }>;
}

export const useHandleAuthentication = (options: HandleAuthenticationOptions) => {
  const { isLoading, signIn, signUp } = options;
  const { toast } = useToast();

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

  return handleAuthentication;
};
