
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface SignOutOptions {
  resetAttemptCount: () => void;
}

export const useSignOut = (options: SignOutOptions) => {
  const { resetAttemptCount } = options;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = useCallback(async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  }, [navigate, resetAttemptCount, toast, isLoading]);

  return { signOut, isLoading };
};
