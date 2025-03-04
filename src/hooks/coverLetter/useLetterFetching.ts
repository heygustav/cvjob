
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchLetterById, fetchJobById } from "@/services/coverLetter/database";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkUtils } from "./useNetworkUtils";
import { GenerationProgress } from "./types";

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
  const { fetchWithTimeout } = useNetworkUtils();

  const fetchLetter = useCallback(async (id: string) => {
    if (!isMountedRef.current) return null;
    
    try {
      console.log("fetchLetter: Starting fetch for letter with ID:", id);
      safeSetState(setLoadingState, "initializing");
      safeSetState(setGenerationError, null);
      safeSetState(setGenerationPhase, null);
      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 0,
        message: 'Henter ansøgning...'
      });
      
      // Try without timeout first
      let letter;
      try {
        letter = await fetchLetterById(id);
      } catch (directError) {
        console.warn("Direct letter fetch failed, retrying with timeout:", directError);
        letter = await fetchWithTimeout(() => fetchLetterById(id));
      }
      
      if (!isMountedRef.current) {
        console.log("fetchLetter: Component unmounted during letter fetch");
        return null;
      }
      
      if (!letter) {
        console.log("fetchLetter: Letter not found");
        toast(toastMessages.letterNotFound);
        navigate("/dashboard");
        return null;
      }

      console.log("fetchLetter: Fetched letter:", letter);
      safeSetState(setGeneratedLetter, letter);

      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 50,
        message: 'Henter tilhørende job...'
      });

      try {
        // Try without timeout first for the job fetch
        let job;
        try {
          job = await fetchJobById(letter.job_posting_id);
        } catch (directError) {
          console.warn("Direct job fetch for letter failed, retrying with timeout:", directError);
          job = await fetchWithTimeout(() => fetchJobById(letter.job_posting_id));
        }
        
        if (!isMountedRef.current) {
          console.log("fetchLetter: Component unmounted during job fetch");
          return null;
        }
        
        if (job) {
          console.log("fetchLetter: Fetched job for letter:", job);
          safeSetState(setSelectedJob, job);
        } else {
          console.error("fetchLetter: Job not found for letter:", letter.job_posting_id);
        }
      } catch (jobError) {
        console.error("fetchLetter: Error fetching job for letter:", jobError);
        // Non-critical error, continue
      }
      
      if (isMountedRef.current) {
        safeSetState(setGenerationProgress, {
          phase: 'letter-save',
          progress: 100,
          message: 'Ansøgning indlæst'
        });
        
        safeSetState(setStep, 2);
        
        // Ensure we always exit initializing state
        console.log("fetchLetter: Setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
      
      return letter;
    } catch (error) {
      console.error("fetchLetter: Error in fetchLetter:", error);
      
      if (!isMountedRef.current) {
        console.log("fetchLetter: Component unmounted during error handling");
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
        console.log("fetchLetter: Finalizing, setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
    }
  }, [
    isMountedRef, 
    safeSetState, 
    setLoadingState, 
    setGenerationError, 
    setGenerationPhase, 
    setGenerationProgress, 
    fetchWithTimeout, 
    toast, 
    toastMessages, 
    navigate, 
    setGeneratedLetter, 
    setSelectedJob, 
    setStep
  ]);

  return { fetchLetter };
};
