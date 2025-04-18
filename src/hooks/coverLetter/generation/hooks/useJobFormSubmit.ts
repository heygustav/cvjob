
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { handleLetterGeneration } from "../../letter-generation/letterGenerationUtils";
import { setupGenerationTimeout } from "../../letter-generation/generationLogic";
import { ToastMessagesType } from "../../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

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
  const { toast } = useToastAdapter();
  
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
      
      toast({
        title: toastMessages.letterGenerated.title,
        description: toastMessages.letterGenerated.description,
        variant: toastMessages.letterGenerated.variant
      });
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
