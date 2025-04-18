
import { useCallback } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { fetchLetterById, fetchJobById } from "@/services/coverLetter/database";
import { useToastMessages } from "../useToastMessages";
import { GenerationProgress, ToastVariant } from "../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { withTimeout } from "@/utils/asyncHelpers";

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
  const { toast } = useToastAdapter();
  const toastMessages = useToastMessages();

  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!user) {
      toast({
        title: toastMessages.loginRequired.title,
        description: toastMessages.loginRequired.description,
        variant: toastMessages.loginRequired.variant as ToastVariant
      });
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

      let letter;
      try {
        letter = await fetchLetterById(id);
      } catch (directError) {
        console.warn("Direct letter fetch failed, retrying with timeout:", directError);
        letter = await withTimeout(() => fetchLetterById(id));
      }
      
      if (!letter) {
        toast({
          title: toastMessages.letterNotFound.title,
          description: toastMessages.letterNotFound.description,
          variant: toastMessages.letterNotFound.variant as ToastVariant
        });
        safeSetState(setGenerationError, "Ansøgningen blev ikke fundet. Prøv venligst igen eller opret en ny ansøgning.");
        safeSetState(setLoadingState, "idle");
        return null;
      }

      if (!isMountedRef.current) return null;
      
      // Fetch the related job
      if (letter.job_posting_id) {
        try {
          const job = await fetchJobById(letter.job_posting_id);
          if (job) {
            safeSetState(setSelectedJob, job);
          }
        } catch (jobError) {
          console.error("Error fetching job for letter:", jobError);
          // Non-critical error, continue
        }
      }

      safeSetState(setGeneratedLetter, letter);
      safeSetState(setStep, 2);
      safeSetState(setLoadingState, "idle");
      
      return letter;
    } catch (error) {
      console.error("Error fetching letter:", error);
      toast({
        title: toastMessages.networkError.title,
        description: toastMessages.networkError.description,
        variant: toastMessages.networkError.variant as ToastVariant
      });
      safeSetState(setGenerationError, "Der opstod en fejl ved hentning af ansøgningen. Prøv venligst igen.");
      safeSetState(setLoadingState, "idle");
      return null;
    }
  }, [user, isMountedRef, safeSetState, setLoadingState, setSelectedJob, setGeneratedLetter, setStep, setGenerationError, setGenerationPhase, setGenerationProgress, toast, toastMessages]);

  return { fetchLetter };
};
