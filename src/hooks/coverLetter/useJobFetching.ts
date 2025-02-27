
import { useCallback } from "react";
import { JobPosting, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchJobById, fetchLettersForJob } from "@/services/coverLetter/database";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkUtils } from "./useNetworkUtils";
import { GenerationProgress } from "./types";

export const useJobFetching = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<any | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { fetchWithTimeout } = useNetworkUtils();

  const fetchJob = useCallback(async (id: string) => {
    if (!isMountedRef.current) return null;
    
    try {
      console.log("fetchJob: Starting fetch for job with ID:", id);
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationError, null);
      safeSetState(setGenerationPhase, null);
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Henter jobinformation...'
      });
      
      // Try without timeout first to avoid unnecessary delays
      let job;
      try {
        job = await fetchJobById(id);
      } catch (directError) {
        console.warn("Direct fetch failed, retrying with timeout:", directError);
        // Fallback to timeout version if direct fetch fails
        job = await fetchWithTimeout(fetchJobById(id));
      }
      
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during job fetch");
        return null;
      }
      
      if (!job) {
        console.log("fetchJob: Job not found");
        toast(toastMessages.jobNotFound);
        navigate("/dashboard");
        return null;
      }

      console.log("fetchJob: Successfully fetched job:", job);
      safeSetState(setSelectedJob, job);

      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 50,
        message: 'Søger efter eksisterende ansøgninger...'
      });

      try {
        // Try without timeout first
        let letters;
        try {
          letters = await fetchLettersForJob(id);
        } catch (directError) {
          console.warn("Direct letters fetch failed, retrying with timeout:", directError);
          letters = await fetchWithTimeout(fetchLettersForJob(id));
        }
        
        if (!isMountedRef.current) {
          console.log("fetchJob: Component unmounted during letters fetch");
          return null;
        }
        
        if (letters && letters.length > 0) {
          console.log("fetchJob: Found existing letters for job:", letters[0]);
          safeSetState(setGeneratedLetter, letters[0]);
          safeSetState(setStep, 2);
        } else {
          console.log("fetchJob: No existing letters found, staying on step 1");
          safeSetState(setStep, 1);
        }
      } catch (letterError) {
        console.error("fetchJob: Error fetching letters:", letterError);
        // Non-critical error, continue on step 1
        if (isMountedRef.current) {
          safeSetState(setStep, 1);
        }
      }
      
      if (isMountedRef.current) {
        safeSetState(setGenerationProgress, {
          phase: 'job-save',
          progress: 100,
          message: 'Indlæsning fuldført'
        });
        
        // Ensure we always exit initializing state
        console.log("fetchJob: Setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
      
      return job;
    } catch (error) {
      console.error("fetchJob: Error in fetchJob:", error);
      
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during error handling");
        return null;
      }
      
      const isNetworkError = !navigator.onLine || 
        (error instanceof Error && (
          error.message.includes('forbindelse') ||
          error.message.includes('timeout') ||
          error.message.includes('network')
        ));
      
      toast(isNetworkError ? toastMessages.networkError : {
        title: "Fejl ved indlæsning",
        description: error instanceof Error ? error.message : "Der opstod en fejl under indlæsning. Prøv igen senere.",
        variant: "destructive",
      });
      
      navigate("/dashboard");
      return null;
    } finally {
      if (isMountedRef.current) {
        console.log("fetchJob: Finalizing, setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
    }
  }, [navigate, toast, toastMessages, fetchWithTimeout, isMountedRef, safeSetState, setGeneratedLetter, setGenerationError, setGenerationPhase, setGenerationProgress, setLoadingState, setSelectedJob, setStep]);

  return { fetchJob };
};
