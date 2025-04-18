
import { useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { ToastMessagesType } from "../types";

// Define specific types for tracking and error handling
export interface GenerationTrackingTools {
  abortGeneration: () => AbortController;
  incrementAttempt: (ref: React.MutableRefObject<number>) => number;
  updatePhase: (phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save', progress: number, message: string) => void;
}

export interface ErrorHandlingTools {
  handleGenerationError: (error: Error) => void;
}

export interface GenerationResult {
  job: JobPosting;
  letter: CoverLetter;
}

// Strongly typed props
export interface UseJobFormSubmitProps {
  user: User | null;
  loadingState: string;
  selectedJob: JobPosting | null;
  isMountedRef: React.MutableRefObject<boolean>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  generationTracking: GenerationTrackingTools;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  toastMessages: ToastMessagesType;
  errorHandling: ErrorHandlingTools;
}

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
  toastMessages,
  errorHandling
}: UseJobFormSubmitProps) => {
  const { toast } = useToastAdapter();
  
  const { 
    abortGeneration, 
    incrementAttempt, 
    updatePhase 
  } = generationTracking;
  
  const { handleGenerationError } = errorHandling;

  // Return type is now explicit
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData): Promise<void> => {
    try {
      safeSetState(setLoadingState, "generating");
      
      // Mock generation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create properly typed job posting
      const job: JobPosting = { 
        id: jobData.id || Math.random().toString(),
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person || null,
        url: jobData.url || null,
        deadline: jobData.deadline || null,
        user_id: user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Create properly typed cover letter
      const letter: CoverLetter = {
        id: Math.random().toString(),
        content: `Generated letter for ${jobData.title} at ${jobData.company}`,
        user_id: user?.id || '',
        job_posting_id: job.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      safeSetState(setSelectedJob, job);
      safeSetState(setGeneratedLetter, letter);
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
