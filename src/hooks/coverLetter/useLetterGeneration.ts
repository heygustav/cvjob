
import { useCallback } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "./types";
import { useGenerationTracking } from "./generation-tracking";
import { useGenerationErrorHandling } from "./generation-error-handling";
import { useGenerationSteps } from "./useGenerationSteps";
import { useLetterGenerationHook } from "./letter-generation";

// The main hook now acts as a facade that composes the more specialized hooks
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
  loadingState: string
) => {
  // Get tracking utilities first
  const tracking = useGenerationTracking({
    isMountedRef, 
    safeSetState, 
    setGenerationPhase, 
    setGenerationProgress
  });
  
  const { 
    incrementAttempt, 
    abortGeneration, 
    updatePhase 
  } = tracking;

  // Get error handling utilities
  const { 
    handleGenerationError 
  } = useGenerationErrorHandling({
    isMountedRef, 
    safeSetState, 
    setGenerationError, 
    setLoadingState
  });

  // Get generation steps (now using updatePhase that's already defined)
  const generationSteps = useGenerationSteps(
    user, 
    isMountedRef, 
    updatePhase, 
    abortControllerRef
  );

  // Collect tracking methods into an object
  const generationTracking = {
    incrementAttempt,
    abortGeneration,
    updatePhase
  };

  // Collect error handling into an object
  const errorHandling = {
    handleGenerationError
  };

  // Use the refactored letter generation hook
  const { handleJobFormSubmit } = useLetterGenerationHook(
    user,
    generationAttemptRef,
    abortControllerRef,
    isMountedRef,
    safeSetState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setLoadingState,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress,
    selectedJob,
    loadingState,
    generationSteps,
    generationTracking,
    errorHandling
  );

  return { handleJobFormSubmit };
};
