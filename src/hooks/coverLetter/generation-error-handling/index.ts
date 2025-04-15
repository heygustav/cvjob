
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "../useToastMessages";
import { handleTypedError, handleStandardError, handleTimeoutError } from "./errorHandlers";
import { GenerationErrorHandlingProps } from "./types";
import { isTimeoutError, showErrorToast } from "@/utils/errorHandling";

export const useGenerationErrorHandling = ({
  isMountedRef,
  safeSetState,
  setGenerationError,
  setLoadingState
}: GenerationErrorHandlingProps) => {
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
    
    // Default error settings
    let result = {
      title: "Fejl ved generering",
      description: "Der opstod en ukendt fejl. Prøv venligst igen.",
      recoverable: true
    };
    
    // Check if component was unmounted
    if (error instanceof Error && error.message === 'Component unmounted') {
      console.log("Generation cancelled due to component unmount");
      return;
    }
    
    // Check if it was a timeout error
    if (isTimeoutError(error)) {
      console.error("Generation timed out");
      toast(toastMessages.generationTimeout);
      safeSetState(setGenerationError, "Generering tog for lang tid. Prøv igen senere.");
      return;
    }
    
    // Handle typed errors with phases
    if ((error as any).phase) {
      result = handleTypedError(error);
    } else if (error instanceof Error) {
      // Handle regular errors
      result = handleStandardError(error);
    }
    
    // Display toast with error details
    showErrorToast(error);
    
    // Set error state for UI to show
    safeSetState(setGenerationError, result.description);
    
    // If not recoverable, navigate away
    if (!result.recoverable) {
      navigate("/dashboard");
    }
    
    // Reset loading state
    if (isMountedRef.current) {
      safeSetState(setLoadingState, "idle");
    }

    return result;
  }, [isMountedRef, navigate, safeSetState, setGenerationError, setLoadingState, toast, toastMessages]);

  return { handleGenerationError };
};
