
import { User } from "@/lib/types";
import { useToastMessages } from "../useToastMessages";
import { useGenerationTracking } from "../generation-tracking";
import { useGenerationErrorHandling } from "../generation-error-handling";
import { useGenerationSteps } from "./hooks/useGenerationSteps";
import { useJobFetchingLogic } from "./hooks/useJobFetchingLogic";
import { useLetterFetchingLogic } from "./hooks/useLetterFetchingLogic";
import { useLetterEditingLogic } from "./hooks/useLetterEditingLogic";
import { useRefsAndCleanup } from "./hooks/useRefsAndCleanup";
import { useSafeSetState } from "./hooks/useSafeSetState";
import { useGenerationState } from "./hooks/useGenerationState";
import { useJobFormSubmit } from "./hooks/useJobFormSubmit";

export const useCoverLetterGeneration = (user: User | null) => {
  const { generationAttemptRef, abortControllerRef, isMountedRef } = useRefsAndCleanup();
  const safeSetState = useSafeSetState(isMountedRef);
  
  const {
    step, loadingState, selectedJob, generatedLetter, generationError, 
    generationPhase, generationProgress,
    
    setStep, setLoadingState, setSelectedJob, setGeneratedLetter,
    setGenerationError, setGenerationPhase, setGenerationProgress,
    
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

  // Fix the arguments to match the function signature
  const generationSteps = useGenerationSteps(
    setStep,
    setGenerationError,
    setGeneratedLetter,
    safeSetState
  );

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
