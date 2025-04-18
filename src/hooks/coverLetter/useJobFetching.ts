
import { useCallback } from "react";
import { JobPosting, User } from "@/lib/types";
import { fetchJobById } from "@/services/coverLetter/database";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkHelpers } from "@/hooks/shared/useNetworkHelpers";
import { showErrorToast } from "@/utils/errorHandling";
import { GenerationProgress } from "./types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";
import { withTimeout } from "@/utils/asyncHelpers";

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
  const networkHelpers = useNetworkHelpers();

  const fetchJob = useCallback(async (id: string): Promise<JobPosting | null> => {
    if (!user) {
      console.error("fetchJob: No authenticated user");
      toast({
        title: toastMessages.loginRequired.title,
        description: toastMessages.loginRequired.description,
        variant: "destructive"
      });
      navigate("/login");
      return null;
    }
    
    if (!isMountedRef.current) {
      console.log("fetchJob: Component unmounted before fetch started");
      return null;
    }
    
    try {
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationError, null);
      safeSetState(setGenerationPhase, "job-fetch");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Henter job...'
      });
      
      console.log(`fetchJob: Starting job fetch for ID: ${id}`);
      
      // Try without timeout first
      let job: JobPosting | null;
      try {
        job = await fetchJobById(id);
      } catch (directError) {
        console.warn("Direct job fetch failed, retrying with timeout:", directError);
        job = await withTimeout(() => fetchJobById(id));
      }
      
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during job fetch");
        return null;
      }
      
      if (!job) {
        console.log("fetchJob: Job not found");
        toast({
          title: toastMessages.jobNotFound.title,
          description: toastMessages.jobNotFound.description,
          variant: "destructive"
        });
        safeSetState(setGenerationError, "Jobbet blev ikke fundet. Prøv venligst igen eller opret et nyt job.");
        safeSetState(setLoadingState, "idle");
        return null;
      }
      
      console.log("fetchJob: Job fetched successfully:", job.title);
      safeSetState(setSelectedJob, job);
      safeSetState(setLoadingState, "idle");
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 100,
        message: 'Job indlæst!'
      });
      
      return job;
    } catch (error) {
      console.error("fetchJob: Error fetching job:", error);
      
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during error handling");
        return null;
      }
      
      showErrorToast(error);
      safeSetState(setGenerationError, "Der opstod en fejl ved hentning af jobbet. Prøv venligst igen.");
      safeSetState(setLoadingState, "idle");
      return null;
    }
  }, [
    user, 
    isMountedRef, 
    safeSetState, 
    setSelectedJob, 
    setGenerationError, 
    setGenerationPhase, 
    setGenerationProgress, 
    setLoadingState, 
    navigate, 
    showErrorToast,
    toast,
    toastMessages
  ]);

  return { fetchJob };
};
