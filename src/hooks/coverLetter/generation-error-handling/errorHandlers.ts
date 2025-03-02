
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

// Handle typed errors with specific phases
export const handleTypedError = (error: TypedError): GenerationErrorResult => {
  const phase = error.phase || 'generation';
  const recoverable = error.recoverable !== false; // Default to true if not specified
  
  let result: GenerationErrorResult = {
    title: "Fejl ved generering",
    description: error.message || "Der opstod en ukendt fejl. Prøv venligst igen.",
    recoverable
  };
  
  switch (phase) {
    case 'user-fetch':
      result.title = "Fejl ved hentning af profil";
      result.description = error.message || "Kunne ikke hente din profil. Prøv at opdatere siden.";
      break;
    case 'job-save':
      result.title = "Fejl ved gemning af job";
      result.description = error.message || "Kunne ikke gemme jobdetaljerne. Prøv igen.";
      break;
    case 'generation':
      result.title = "Fejl ved generering";
      result.description = error.message || "Kunne ikke generere ansøgningen. Prøv igen senere.";
      break;
    case 'letter-save':
      result.title = "Fejl ved gemning";
      result.description = error.message || "Ansøgningen blev genereret, men kunne ikke gemmes.";
      break;
  }
  
  return result;
};

// Handle standard errors (Error instances without specific phase information)
export const handleStandardError = (error: Error): GenerationErrorResult => {
  let recoverable = true;
  let title = "Fejl ved generering";
  let description = error.message || "Der opstod en ukendt fejl. Prøv venligst igen.";
  
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
