
import { useCallback } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { fetchJobById } from "@/services/coverLetter/database";
import { GenerationProgress } from "../../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { useToastMessages } from "../../useToastMessages";

export const useJobFetchingLogic = (
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

  const fetchJob = useCallback(async (id: string): Promise<JobPosting | null> => {
    if (!user) {
      toast({
        title: toastMessages.loginRequired.title,
        description: toastMessages.loginRequired.description,
        variant: toastMessages.loginRequired.variant
      });
      return null;
    }

    if (!isMountedRef.current) return null;

    try {
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationPhase, "job-fetch");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 30,
        message: 'Henter job...'
      });

      const job = await fetchJobById(id);
      
      if (!job) {
        toast({
          title: toastMessages.jobNotFound.title,
          description: toastMessages.jobNotFound.description,
          variant: toastMessages.jobNotFound.variant
        });
        safeSetState(setGenerationError, "Jobbet blev ikke fundet. Prøv venligst igen eller opret et nyt job.");
        safeSetState(setLoadingState, "idle");
        return null;
      }

      if (!isMountedRef.current) return null;

      safeSetState(setSelectedJob, job);
      safeSetState(setLoadingState, "idle");
      console.log("Job fetched:", job.title);
      
      return job;
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: toastMessages.networkError.title,
        description: toastMessages.networkError.description,
        variant: toastMessages.networkError.variant
      });
      safeSetState(setGenerationError, "Der opstod en fejl ved hentning af jobbet. Prøv venligst igen.");
      safeSetState(setLoadingState, "idle");
      return null;
    }
  }, [user, isMountedRef, safeSetState, setLoadingState, setSelectedJob, setGenerationError, setGenerationPhase, setGenerationProgress, toast, toastMessages]);

  return { fetchJob };
};
