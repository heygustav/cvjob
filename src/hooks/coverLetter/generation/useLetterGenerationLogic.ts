
import { useCallback } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useNavigate } from "react-router-dom";
import { ToastMessagesType } from "../types";
import { handleLetterGeneration } from "../letter-generation/letterGenerationUtils";
import { setupGenerationTimeout } from "../letter-generation/generationLogic";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

export const useLetterGenerationLogic = (
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
  setGenerationProgress: React.Dispatch<React.SetStateAction<any>>,
  selectedJob: JobPosting | null,
  loadingState: string,
  generationSteps: any,
  generationTracking: any,
  errorHandling: any,
  toastMessages: ToastMessagesType
) => {
  const { toast } = useToastAdapter();
  const navigate = useNavigate();
  
  // Destructure tracking and error handling methods
  const { 
    incrementAttempt, 
    abortGeneration, 
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
