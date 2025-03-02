import { useState, useCallback, useRef, useEffect } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useToastMessages } from "./coverLetter/useToastMessages";
import { useJobFetching } from "./coverLetter/useJobFetching";
import { useLetterFetching } from "./coverLetter/useLetterFetching";
import { useLetterGeneration } from "./coverLetter/useLetterGeneration";
import { useLetterEditing } from "./coverLetter/useLetterEditing";
import { LoadingState, GenerationProgress } from "./coverLetter/types";

export const useCoverLetterGeneration = (user: User | null) => {
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
  
  const generationAttemptRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Get toast messages
  const toastMessages = useToastMessages();

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    // Set mount state
    isMountedRef.current = true;
    
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;
      
      // Clear any pending generation timeout
      if ((window as any).__generationTimeoutId) {
        clearTimeout((window as any).__generationTimeoutId);
        (window as any).__generationTimeoutId = null;
      }
      
      // Abort any in-progress API calls
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Derived state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";
  const isInitializing = loadingState === "initializing";

  // Safe state updater helpers that check if component is still mounted
  const safeSetState = useCallback(<T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, []);

  // Initialize hooks for different functionalities
  const { fetchJob } = useJobFetching(
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

  const { fetchLetter } = useLetterFetching(
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

  const { handleJobFormSubmit } = useLetterGeneration(
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
    loadingState
  );

  const { handleEditLetter, handleSaveLetter, saveJobAsDraft, resetError } = useLetterEditing(
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
