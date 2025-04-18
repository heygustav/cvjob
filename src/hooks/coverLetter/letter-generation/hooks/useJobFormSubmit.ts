
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
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
  const { toast } = useToastAdapter();
  
  const { 
    abortGeneration, 
    incrementAttempt, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  // Simplified job form submit handler for now, to be expanded later
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    try {
      safeSetState(setLoadingState, "generating");
      
      // Mock generation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success case
      safeSetState(setSelectedJob, { 
        ...jobData, 
        id: jobData.id || Math.random().toString(),
        user_id: user?.id || ''
      });
      
      safeSetState(setGeneratedLetter, {
        id: Math.random().toString(),
        content: `Generated letter for ${jobData.title} at ${jobData.company}`,
        user_id: user?.id || '',
        job_posting_id: jobData.id || Math.random().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      safeSetState(setStep, 2);
      
      toast({
        title: toastMessages.letterGenerated.title,
        description: toastMessages.letterGenerated.description,
        variant: toastMessages.letterGenerated.variant
      });
    } catch (error) {
      handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      safeSetState(setLoadingState, "idle");
    }
  }, [
    user,
    safeSetState,
    setLoadingState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    toastMessages,
    toast,
    handleGenerationError
  ]);

  return handleJobFormSubmit;
};
