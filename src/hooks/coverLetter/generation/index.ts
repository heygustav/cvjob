
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { LoadingState, GenerationProgress } from "../types";
import { useToastMessages } from "../useToastMessages";
import { useGenerationTracking } from "../generation-tracking";
import { useGenerationErrorHandling } from "../generation-error-handling";
import { useGenerationSteps } from "../useGenerationSteps"; // Changed import path to use the correct implementation
import { useJobFetchingLogic } from "../generation/useJobFetchingLogic";
import { useLetterFetchingLogic } from "../generation/useLetterFetchingLogic";
import { useLetterEditingLogic } from "../generation/useLetterEditingLogic";

// Import refactored hooks
import { useRefsAndCleanup } from "./hooks/useRefsAndCleanup";
import { useSafeSetState } from "./hooks/useSafeSetState";
import { useGenerationState } from "./hooks/useGenerationState";
import { useJobFormSubmit } from "./hooks/useJobFormSubmit";

export const useCoverLetterGeneration = (user: User | null) => {
  // Use our refactored hooks for better organization
  const { generationAttemptRef, abortControllerRef, isMountedRef } = useRefsAndCleanup();
  const safeSetState = useSafeSetState(isMountedRef);
  
  const {
    // State
    step, loadingState, selectedJob, generatedLetter, generationError, 
    generationPhase, generationProgress,
    
    // Setters
    setStep, setLoadingState, setSelectedJob, setGeneratedLetter,
    setGenerationError, setGenerationPhase, setGenerationProgress,
    
    // Derived state
    isLoading, isGenerating
  } = useGenerationState();

  // Compose hooks
  const toastMessages = useToastMessages();
  
  const generationTracking = useGenerationTracking({
    isMountedRef,
    safeSetState,
    setGenerationPhase,
    setGenerationProgress
  });

  const errorHandling = useGenerationErrorHandling({
    isMountedRef,
    safeSetState,
    setGenerationError,
    setLoadingState
  });

  // Use the hook without arguments since it no longer requires any
  const generationSteps = useGenerationSteps();

  // Domain-specific hooks
  const { fetchJob } = useJobFetchingLogic(
    user,
    isMountedRef,
    safeSetState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setLoadingState,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress
  );

  const { fetchLetter } = useLetterFetchingLogic(
    user,
    isMountedRef,
    safeSetState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setLoadingState,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress
  );

  // Use our refactored job form submit hook
  const handleJobFormSubmit = useJobFormSubmit(
    user,
    loadingState,
    selectedJob,
    isMountedRef,
    abortControllerRef,
    generationTracking,
    safeSetState,
    setGenerationError,
    setGenerationPhase,
    setLoadingState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    toastMessages,
    generationSteps,
    errorHandling
  );

  const { 
    handleEditLetter, 
    handleSaveLetter, 
    saveJobAsDraft, 
    resetError 
  } = useLetterEditingLogic(
    user,
    isMountedRef,
    safeSetState,
    setGeneratedLetter,
    setLoadingState,
    setGenerationProgress,
    generatedLetter
  );

  return {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    generationProgress,
    selectedJob,
    generatedLetter,
    generationError,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError,
  };
};
