
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { ToastMessagesType } from "../types";
import { JobFormSubmitConfig, GenerationResult } from "./types";
import { generateMockLetter, setupGenerationTimeout, cleanupGeneration } from "./utils";
import { isNonNull } from "@/utils/typeGuards";

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
}: JobFormSubmitConfig) => {
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

    // Abort any existing generation
    if (abortControllerRef.current) {
      abortGeneration();
    }

    let timeoutId: number | undefined;

    try {
      safeSetState(setLoadingState, "generating");
      
      // Set up timeout to abort generation if it takes too long
      timeoutId = setupGenerationTimeout(abortControllerRef, {
        handleTimeoutCallback: (error) => handleGenerationError(error)
      });
      
      // Increment the attempt counter
      incrementAttempt(abortControllerRef.current?.signal ? {} as any : {} as any);
      
      // In a real app, this would call a service to generate the letter
      // For now, we use a mock implementation
      const result = await generateMockLetter(
        jobData,
        user.id,
        updatePhase
      );
      
      if (!isMountedRef.current) return;
      
      // Update state with generation results
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
      
      // Clean up resources
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
