
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { handleLetterGeneration, setupGenerationTimeout } from "../letterGenerationUtils";
import { ToastMessagesType } from "../../types";

export const useJobFormSubmit = (
  user: User | null,
  loadingState: string,
  selectedJob: any,
  isMountedRef: React.MutableRefObject<boolean>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  generationTracking: any,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setSelectedJob: React.Dispatch<React.SetStateAction<any>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<any>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  toastMessages: ToastMessagesType,
  generationSteps: any,
  errorHandling: any
) => {
  const { toast } = useToast();
  
  const { 
    abortGeneration, 
    incrementAttempt, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  // Use the shared letter generation logic
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    const result = await handleLetterGeneration(
      jobData,
      user,
      loadingState,
      selectedJob,
      isMountedRef,
      abortControllerRef,
      abortGeneration,
      incrementAttempt,
      updatePhase,
      safeSetState,
      setGenerationError,
      setGenerationPhase,
      setLoadingState,
      toastMessages,
      toast,
      generationSteps,
      handleGenerationError,
      setupGenerationTimeout
    );
    
    if (result) {
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast(toastMessages.letterGenerated);
    }
  }, [
    user,
    loadingState,
    selectedJob,
    isMountedRef,
    abortControllerRef,
    abortGeneration,
    incrementAttempt,
    updatePhase,
    safeSetState,
    setGenerationError,
    setGenerationPhase,
    setLoadingState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    toastMessages,
    toast,
    generationSteps,
    handleGenerationError
  ]);

  return handleJobFormSubmit;
};
