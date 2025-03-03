import { useCallback, useRef, useState, useEffect } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { LoadingState, GenerationProgress } from "../types";
import { useToastMessages } from "../useToastMessages";
import { useGenerationTracking } from "../generation-tracking";
import { useGenerationErrorHandling } from "../generation-error-handling";
import { useGenerationSteps } from "../useGenerationSteps";
import { useJobFetchingLogic } from "./useJobFetchingLogic";
import { useLetterFetchingLogic } from "./useLetterFetchingLogic";
import { useLetterGenerationLogic } from "./useLetterGenerationLogic";
import { useLetterEditingLogic } from "./useLetterEditingLogic";

export const useCoverLetterGeneration = (user: User | null) => {
  // State management
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  });
  
  // Refs
  const generationAttemptRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      if ((window as any).__generationTimeoutId) {
        clearTimeout((window as any).__generationTimeoutId);
        (window as any).__generationTimeoutId = null;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Safe state updater
  const safeSetState = useCallback(<T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, []);

  // Derived state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";
  const isInitializing = loadingState === "initializing";

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

  const generationSteps = useGenerationSteps(
    user,
    isMountedRef,
    generationTracking.updatePhase,
    abortControllerRef
  );

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

  const { handleJobFormSubmit } = useLetterGenerationLogic(
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
    errorHandling,
    toastMessages
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
