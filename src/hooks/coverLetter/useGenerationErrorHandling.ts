
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";

export const useGenerationErrorHandling = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();

  const handleGenerationError = useCallback((
    error: any, 
    currentAttempt: number, 
    timeoutId: number | null
  ) => {
    console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
    
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted after error");
      return;
    }
    
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
      toast(toastMessages.generationTimeout);
      safeSetState(setGenerationError, "Generering tog for lang tid. Prøv igen senere.");
      return;
    }
    
    // Handle typed errors with phases
    if ((error as any).phase) {
      const typedError = error as any;
      recoverable = typedError.recoverable;
      
      switch (typedError.phase) {
        case 'job-save':
          description = "Kunne ikke gemme jobinformation. Tjek venligst din forbindelse.";
          break;
        case 'user-fetch':
          description = "Kunne ikke hente din profilinformation. Prøv at opdatere din profil.";
          break;
        case 'generation':
          title = "Generering mislykkedes";
          description = "AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.";
          break;
        case 'letter-save':
          description = "Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.";
          break;
      }
    } else if (error instanceof Error) {
      // Handle regular errors
      description = error.message;
      
      // Check for network-related errors
      const isNetworkError = !navigator.onLine || 
        error.message.includes('forbindelse') || 
        error.message.includes('timeout') ||
        error.message.includes('network');
      
      if (isNetworkError) {
        title = "Forbindelsesfejl";
        description = "Kontroller din internetforbindelse og prøv igen.";
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

    return { title, description, recoverable };
  }, [isMountedRef, navigate, safeSetState, setGenerationError, setLoadingState, toast, toastMessages]);

  return { handleGenerationError };
};
