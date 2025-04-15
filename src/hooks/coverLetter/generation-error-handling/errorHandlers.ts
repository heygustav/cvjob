
import { 
  createAppError, 
  getErrorPhase, 
  getErrorTitle, 
  getErrorMessage, 
  showErrorToast 
} from "@/utils/errorHandling";
import { GenerationErrorHandlers, GenerationErrorResult, TypedError } from "./types";

export const useErrorHandlers = ({
  isMountedRef,
  safeSetState,
  setGenerationError,
  setLoadingState
}: GenerationErrorHandlers) => {
  /**
   * Handles errors during the generation process
   */
  const handleGenerationError = (error: unknown, currentAttempt: number, timeoutId?: number): void => {
    console.error(`Attempt #${currentAttempt}: Error during generation:`, error);
    
    // Clear any timeouts
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if ((window as any).__generationTimeoutId) {
      clearTimeout((window as any).__generationTimeoutId);
      (window as any).__generationTimeoutId = null;
    }
    
    // Only update state if component is still mounted
    if (isMountedRef.current) {
      // Extract the error message using our utility
      const errorMessage = getErrorMessage(error, "Der opstod en uventet fejl. Prøv igen.");
      
      // Set the error state
      safeSetState(setGenerationError, errorMessage);
      safeSetState(setLoadingState, "idle");
      
      console.log("Generation error state set to:", errorMessage);
    }
  };

  return {
    handleGenerationError
  };
};

// Handle typed errors with specific phases
export const handleTypedError = (error: TypedError): GenerationErrorResult => {
  const phase = error.phase || 'generation';
  const recoverable = error.recoverable !== false; // Default to true if not specified
  
  const title = getErrorTitle(phase as any);
  let description = error.message || "Der opstod en ukendt fejl. Prøv venligst igen.";
  
  return { title, description, recoverable };
};

// Handle standard errors (Error instances without specific phase information)
export const handleStandardError = (error: Error): GenerationErrorResult => {
  const phase = getErrorPhase(error);
  const title = getErrorTitle(phase);
  const description = getErrorMessage(error, "Der opstod en ukendt fejl. Prøv venligst igen.");
  
  // By default, most errors are recoverable except auth and service errors
  const recoverable = phase !== 'auth-error' && 
                      phase !== 'service-unavailable';
  
  return { title, description, recoverable };
};

// Handle timeout errors specifically
export const handleTimeoutError = (): GenerationErrorResult => {
  return {
    title: "Generering tog for lang tid",
    description: "Generering af ansøgningen tog for lang tid. Prøv igen senere.",
    recoverable: true
  };
};
