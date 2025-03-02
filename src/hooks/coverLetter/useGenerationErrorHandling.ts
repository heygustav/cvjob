
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useGenerationErrorHandling = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerationError = useCallback((error: any, currentAttempt: number, timeoutId: number | null) => {
    console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
    
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted after error");
      return;
    }
    
    // Default error settings
    let title = "Fejl ved generering";
    let description = "Der opstod en ukendt fejl. Prøv venligst igen.";
    let recoverable = true;
    
    // Check if component was unmounted
    if (error instanceof Error && error.message === 'Component unmounted') {
      console.log("Generation cancelled due to component unmount");
      return;
    }
    
    // Check if it was a timeout error
    if (error instanceof Error && error.message.includes('timed out')) {
      console.error("Generation timed out");
      toast({
        title: "Generering tog for lang tid",
        description: "Forsøg venligst igen senere.",
        variant: "destructive"
      });
      safeSetState(setGenerationError, "Generering tog for lang tid. Prøv igen senere.");
      return;
    }
    
    // Handle typed errors with phases
    if ((error as any).phase) {
      const phase = (error as any).phase;
      switch (phase) {
        case 'user-fetch':
          title = "Fejl ved hentning af profil";
          description = error.message || "Kunne ikke hente din profil. Prøv at opdatere siden.";
          break;
        case 'job-save':
          title = "Fejl ved gemning af job";
          description = error.message || "Kunne ikke gemme jobdetaljerne. Prøv igen.";
          break;
        case 'generation':
          title = "Fejl ved generering";
          description = error.message || "Kunne ikke generere ansøgningen. Prøv igen senere.";
          break;
        case 'letter-save':
          title = "Fejl ved gemning";
          description = error.message || "Ansøgningen blev genereret, men kunne ikke gemmes.";
          break;
      }
      recoverable = (error as any).recoverable !== false;
    } else if (error instanceof Error) {
      // Handle standard errors
      description = error.message;
      
      // Check for common network errors
      if (error.message.includes('network') || error.message.includes('connection')) {
        title = "Netværksfejl";
        description = "Der er problemer med din internetforbindelse. Tjek din forbindelse og prøv igen.";
      } 
      // Check for server errors
      else if (error.message.includes('500') || error.message.includes('server')) {
        title = "Serverfejl";
        description = "Der er problemer med vores server. Prøv igen senere.";
        recoverable = false;
      }
    }
    
    // Display toast with error details
    toast({
      title,
      description,
      variant: "destructive",
    });
    
    // Set error state for UI to show
    safeSetState(setGenerationError, description);
    
    // If not recoverable, navigate away
    if (!recoverable) {
      navigate("/dashboard");
    }
    
    // Reset loading state
    if (isMountedRef.current) {
      safeSetState(setLoadingState, "idle");
    }
  }, [isMountedRef, navigate, safeSetState, setGenerationError, setLoadingState, toast]);

  return { handleGenerationError };
};
