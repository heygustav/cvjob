
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";
import { handleLetterGeneration } from "../../letter-generation/letterGenerationUtils";
import { setupGenerationTimeout } from "../../letter-generation/generationLogic";
import { ToastMessagesType } from "../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

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
  
  const { 
    abortGeneration, 
    incrementAttempt, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  const handleSubmit = useCallback(async (formData: JobFormData) => {
    let timeoutId: number | undefined;

    try {
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

      safeSetState(setLoadingState, "generating");
      
      timeoutId = window.setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          handleGenerationError(new Error("Generation timeout"));
        }
      }, 45000) as unknown as number;

      incrementAttempt(abortControllerRef.current?.signal ? {} as any : {} as any);
      
      // Mock implementation for now
      const result = {
        job: { ...formData, id: 'mock-id' },
        letter: { content: 'Mock letter content', id: 'mock-letter-id' }
      };
      
      if (!isMountedRef.current) return;
      
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er nu klar til gennemsyn.",
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      
      handleGenerationError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
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
    setGenerationError,
    toast,
    abortGeneration,
    incrementAttempt,
    updatePhase,
    handleGenerationError
  ]);

  return handleSubmit;
};
