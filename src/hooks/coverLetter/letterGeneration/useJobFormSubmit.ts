
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { ToastMessagesType } from "../types";
import { setupGenerationTimeout, cleanupGeneration } from "./utils";

export const useJobFormSubmit = ({
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
  errorHandling
}: any) => {
  const { toast } = useToastAdapter();
  const toastMessages = {
    letterGenerated: {
      title: "Ansøgning genereret",
      description: "Din ansøgning er nu klar til gennemsyn.",
    }
  } as ToastMessagesType;
  
  const { 
    abortGeneration, 
    incrementAttempt, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData): Promise<void> => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
        variant: "destructive"
      });
      return;
    }

    if (abortControllerRef.current) {
      abortGeneration();
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      safeSetState(setLoadingState, "generating");
      
      timeoutId = setupGenerationTimeout(abortControllerRef, {
        handleTimeoutCallback: (error) => handleGenerationError(error)
      });
      
      incrementAttempt(abortControllerRef.current?.signal ? {} as any : {} as any);
      
      // Mock implementation for now
      const result = {
        job: { ...jobData, id: 'mock-id' },
        letter: { content: 'Mock letter content', id: 'mock-letter-id' }
      };
      
      if (!isMountedRef.current) return;
      
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast({
        title: toastMessages.letterGenerated.title,
        description: toastMessages.letterGenerated.description,
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      
      handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        safeSetState(setGenerationPhase, null);
      }
      
      cleanupGeneration(timeoutId);
    }
  }, [
    user,
    isMountedRef,
    abortControllerRef,
    safeSetState,
    setLoadingState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setGenerationPhase,
    setGenerationError,
    toast,
    toastMessages,
    abortGeneration,
    incrementAttempt,
    updatePhase,
    handleGenerationError
  ]);

  return handleJobFormSubmit;
};
