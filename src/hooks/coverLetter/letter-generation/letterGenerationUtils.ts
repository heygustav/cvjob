
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { GenerationProgress } from "../types";
import { ToastMessagesType } from "../types";

/**
 * Core letter generation handler used by both generation hooks
 */
export const handleLetterGeneration = async (
  jobData: JobFormData,
  user: User | null,
  loadingState: string,
  selectedJob: any,
  isMountedRef: React.MutableRefObject<boolean>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  abortGeneration: () => AbortController,
  incrementAttempt: () => number,
  updatePhase: (phase: string, progress: number, message: string) => void,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  toastMessages: ToastMessagesType,
  toast: (props: any) => void,
  generationSteps: any,
  handleGenerationError: (error: any, currentAttempt: number, timeoutId: number) => void,
  setupGenerationTimeout: () => [Promise<never>, number]
) => {
  // Validate user login
  if (!user) {
    console.error("Cannot generate letter: No authenticated user");
    toast(toastMessages.loginRequired);
    return;
  }

  // Guard against multiple submissions
  if (loadingState !== "idle") {
    console.warn("Generation already in progress, state:", loadingState);
    toast(toastMessages.generationInProgress);
    return;
  }

  // Skip validation for required fields - we'll use defaults instead
  console.log("Form data for generation:", {
    title: jobData.title || "(missing)",
    company: jobData.company || "(missing)",
    description: jobData.description?.length || 0
  });

  // Cancel any in-progress generation
  const abortController = abortGeneration();

  // Clear any previous errors
  safeSetState(setGenerationError, null);
  safeSetState(setGenerationPhase, null);

  // Initial setup
  updatePhase('job-save', 10, 'Forbereder generering...');

  // Increment generation attempt counter
  const currentAttempt = incrementAttempt();
  console.log(`Starting generation attempt #${currentAttempt} with job data:`, {
    title: jobData.title,
    company: jobData.company,
    descriptionLength: jobData.description?.length
  });

  // Set initial loading state
  safeSetState(setLoadingState, "generating");

  // Create a timeout promise for the entire generation process
  const [timeoutPromise, timeoutId] = setupGenerationTimeout();

  // Create the generation promise
  const generationPromise = executeGenerationProcess(
    jobData,
    user,
    selectedJob,
    { currentAttempt, abortController },
    generationSteps,
    updatePhase,
    isMountedRef
  );

  try {
    // Race between generation and timeout
    const result = await Promise.race([generationPromise, timeoutPromise]);
    
    // Clear timeout
    if ((window as any).__generationTimeoutId) {
      clearTimeout((window as any).__generationTimeoutId);
      (window as any).__generationTimeoutId = null;
    }
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted after generation completed");
      return null;
    }
    
    // Success handling
    console.log("Generation completed successfully:", result);
    
    // Return the result for the caller to use
    return result;
    
  } catch (error) {
    console.error("Generation failed with error:", error);
    handleGenerationError(error, currentAttempt, timeoutId);
    return null;
  } finally {
    console.log(`Attempt #${currentAttempt}: Generation process completed`);
    if (isMountedRef.current) {
      safeSetState(setLoadingState, "idle");
    }
    abortControllerRef.current = null;
  }
};

// Re-export these functions from generationLogic.ts
export { 
  validateUserLogin, 
  validateJobFormData, 
  setupGenerationTimeout, 
  executeGenerationProcess 
} from "./generationLogic";
