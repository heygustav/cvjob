
import { useCallback } from "react";
import { JobPosting, User } from "@/lib/types";
import { fetchJobById } from "@/services/coverLetter/database";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkHelpers } from "@/hooks/shared/useNetworkHelpers";
import { createAppError, showErrorToast } from "@/utils/errorHandling";
import { GenerationProgress } from "./types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

export const useJobFetching = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>
) => {
  const { toast } = useToastAdapter();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { withTimeout, retryWithBackoff } = useNetworkHelpers();

  const fetchJob = useCallback(async (id: string): Promise<JobPosting | null> => {
    if (!user) {
      const error = createAppError(
        "No authenticated user",
        'auth-error',
        false
      );
      showErrorToast(error);
      navigate("/login");
      return null;
    }
    
    if (!isMountedRef.current) return null;
    
    try {
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationError, null);
      safeSetState(setGenerationPhase, "job-fetch");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Henter job...'
      });
      
      const job = await retryWithBackoff(
        async () => {
          const result = await withTimeout(() => fetchJobById(id));
          if (!result) {
            throw createAppError(
              "Job not found",
              'job-save',
              true
            );
          }
          return result;
        }
      );
      
      if (!isMountedRef.current) return null;
      
      safeSetState(setSelectedJob, job);
      safeSetState(setLoadingState, "idle");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 100,
        message: 'Job indlæst!'
      });
      
      return job;
    } catch (error) {
      if (!isMountedRef.current) return null;
      
      showErrorToast(error);
      safeSetState(setGenerationError, error instanceof Error ? error.message : "Der opstod en fejl");
      safeSetState(setLoadingState, "idle");
      return null;
    }
  }, [
    user,
    isMountedRef,
    navigate,
    safeSetState,
    setSelectedJob,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress,
    setLoadingState,
    withTimeout,
    retryWithBackoff,
    toast,
    toastMessages
  ]);

  return { fetchJob };
};
