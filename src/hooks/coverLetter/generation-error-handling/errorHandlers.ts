
import { GenerationErrorHandlers } from "./types";

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
      // Extract the error message
      let errorMessage = "Der opstod en uventet fejl. Prøv igen.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
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
