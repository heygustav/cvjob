import { useCallback } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchLetterById, fetchJobById } from "@/services/coverLetter/database";
import { useToastMessages } from "../useToastMessages";
import { GenerationProgress } from "../types";

export const useLetterFetchingLogic = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();

  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!user) {
      toast(toastMessages.loginRequired);
      return null;
    }

    if (!isMountedRef.current) return null;

    try {
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationPhase, "letter-fetch");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 30,
        message: 'Henter ansøgning...'
      });

      const letter = await fetchLetterById(id);
      
      if (!letter) {
        toast(toastMessages.letterNotFound);
        safeSetState(setGenerationError, "Ansøgningen blev ikke fundet. Prøv venligst igen eller opret en ny ansøgning.");
        safeSetState(setLoadingState, "idle");
        return null;
      }

      if (!isMountedRef.current) return null;
      
      // Fetch the related job
      if (letter.job_posting_id) {
        const job = await fetchJobById(letter.job_posting_id);
        if (job) {
          safeSetState(setSelectedJob, job);
        }
      }

      safeSetState(setGeneratedLetter, letter);
      safeSetState(setStep, 2);
      safeSetState(setLoadingState, "idle");
      
      return letter;
    } catch (error) {
      console.error("Error fetching letter:", error);
      toast(toastMessages.networkError);
      safeSetState(setGenerationError, "Der opstod en fejl ved hentning af ansøgningen. Prøv venligst igen.");
      safeSetState(setLoadingState, "idle");
      return null;
    }
  }, [user, isMountedRef, safeSetState, setLoadingState, setSelectedJob, setGeneratedLetter, setStep, setGenerationError, setGenerationPhase, setGenerationProgress, toast, toastMessages]);

  return { fetchLetter };
};
