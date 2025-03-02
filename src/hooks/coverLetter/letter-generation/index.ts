
import { useCallback } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "../useToastMessages";
import { GenerationProgress } from "../types";
import { 
  validateJobFormData, 
  validateUserLogin, 
  setupGenerationTimeout, 
  executeGenerationProcess 
} from "./generationLogic";

export const useLetterGeneration = (
  user: User | null,
  generationAttemptRef: React.MutableRefObject<number>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  selectedJob: JobPosting | null,
  loadingState: string,
  generationSteps: any,
  generationTracking: any,
  errorHandling: any
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  
  // Destructure tracking and error handling methods
  const { 
    incrementAttempt, 
    abortGeneration, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    // Validate user login
    if (!validateUserLogin(user)) {
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

    // Form validation
    if (!validateJobFormData(jobData)) {
      console.error("Form validation failed: Missing required fields");
      toast(toastMessages.missingFields);
      return;
    }

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
      user!,
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
        return;
      }
      
      // Success handling
      console.log("Generation completed successfully:", result);
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast(toastMessages.letterGenerated);
      
    } catch (error) {
      handleGenerationError(error, currentAttempt, timeoutId);
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
      }
      abortControllerRef.current = null;
    }
  }, [
    abortControllerRef, 
    abortGeneration, 
    handleGenerationError, 
    incrementAttempt, 
    isMountedRef, 
    loadingState, 
    navigate, 
    safeSetState, 
    selectedJob, 
    setGeneratedLetter, 
    setGenerationError, 
    setGenerationPhase, 
    setGenerationProgress, 
    setLoadingState, 
    setSelectedJob, 
    setStep, 
    toast, 
    toastMessages, 
    updatePhase, 
    user,
    generationSteps
  ]);

  return { handleJobFormSubmit };
};
