
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkHelpers } from "@/hooks/shared/useNetworkHelpers";
import { createAppError, showErrorToast } from "@/utils/errorHandling";
import { GenerationProgress } from "./types";
import { withTimeout } from "@/utils/errorHandling";
import { fetchJobById, fetchLetterById } from "@/services/coverLetter/database";

export const useLetterFetching = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<any | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { retryWithBackoff } = useNetworkHelpers();

  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!isMountedRef.current) return null;
    
    try {
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationError, null);
      safeSetState(setGenerationPhase, null);
      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 0,
        message: 'Henter ansøgning...'
      });

      const letter = await withTimeout(
        () => fetchLetterById(id),
        15000
      );
      
      if (!isMountedRef.current) return null;

      if (!letter) {
        throw createAppError(
          "Letter not found",
          'letter-save',
          true
        );
      }

      safeSetState(setGeneratedLetter, letter);
      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 50,
        message: 'Henter tilhørende job...'
      });

      try {
        const job = await withTimeout(
          () => fetchJobById(letter.job_posting_id),
          15000
        );

        if (!isMountedRef.current) return null;
        
        if (job) {
          safeSetState(setSelectedJob, job);
        }
      } catch (jobError) {
        showErrorToast(jobError);
        console.error("Error fetching job for letter:", jobError);
      }

      if (isMountedRef.current) {
        safeSetState(setGenerationProgress, {
          phase: 'letter-save',
          progress: 100,
          message: 'Ansøgning indlæst'
        });
        safeSetState(setStep, 2);
        safeSetState(setLoadingState, "idle");
      }

      return letter;
    } catch (error) {
      if (!isMountedRef.current) return null;
      
      showErrorToast(error);
      navigate("/dashboard");
      return null;
    }
  }, [
    isMountedRef,
    safeSetState,
    setLoadingState,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress,
    setGeneratedLetter,
    setSelectedJob,
    setStep,
    navigate,
    retryWithBackoff,
    toast,
    toastMessages
  ]);

  return { fetchLetter };
};
