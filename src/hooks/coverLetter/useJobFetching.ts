
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
    if (!isMountedRef.current) {
      console.log("Component not mounted, aborting fetchJob");
      return null;
    }
    
    // Always reset states at the beginning
    safeSetState(setLoadingState, "idle"); // Start with idle instead of initializing
    safeSetState(setGenerationError, null);
    safeSetState(setGenerationPhase, null);
    safeSetState(setGenerationProgress, {
      phase: 'job-fetch',
      progress: 0,
      message: 'Henter jobinformation...'
    });
    
    // Get URL parameters once for consistent use throughout
    const urlParams = new URLSearchParams(window.location.search);
    const isDirectAccess = urlParams.get('direct') === 'true' || urlParams.get('step') === '1';
    console.log(`fetchJob: Direct access mode: ${isDirectAccess}`);
    
    let job = null;
    
    try {
      console.log("fetchJob: Starting fetch for job with ID:", id);
      
      // Only set loading state for non-direct access
      if (!isDirectAccess) {
        safeSetState(setLoadingState, "initializing");
      }
      
      // Try direct fetch
      try {
        job = await fetchJobById(id);
        console.log("fetchJob: Job fetched successfully on first attempt:", job?.id);
      } catch (directError) {
        console.warn("Direct fetch failed, retrying with timeout:", directError);
        // Fallback to timeout version if direct fetch fails
        job = await fetchWithTimeout(fetchJobById(id));
        console.log("fetchJob: Job fetched successfully on second attempt:", job?.id);
      }
      
      // Check if component unmounted during fetch
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during job fetch");
        return null;
      }
      
      // Handle job not found
      if (!job) {
        console.log("fetchJob: Job not found");
        toast(toastMessages.jobNotFound);
        safeSetState(setLoadingState, "idle");
        navigate("/dashboard");
        return null;
      }

      console.log("fetchJob: Successfully fetched job:", job);
      safeSetState(setSelectedJob, job);
      
      // Update progress for letter fetching
      safeSetState(setGenerationProgress, {
        phase: 'job-fetch',
        progress: 50,
        message: 'Søger efter eksisterende ansøgninger...'
      });

      // For direct access mode, we don't need to fetch letters - go straight to step 1
      if (isDirectAccess) {
        console.log("fetchJob: Direct access mode - skipping letter fetch and setting step to 1");
        safeSetState(setStep, 1);
        safeSetState(setLoadingState, "idle");
        return job;
      }

      // Only check for existing letters if not in direct access mode
      try {
        let letters;
        try {
          console.log("fetchJob: Fetching letters for job:", id);
          letters = await fetchLettersForJob(id);
        } catch (directError) {
          console.warn("Direct letters fetch failed, retrying with timeout:", directError);
          letters = await fetchWithTimeout(fetchLettersForJob(id));
        }
        
        // Check if component unmounted during letter fetch
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
        // Non-critical error, ensure we stay on step 1
        if (isMountedRef.current) {
          safeSetState(setStep, 1);
        }
      }
      
      // Mark job fetch as complete
      if (isMountedRef.current) {
        safeSetState(setGenerationProgress, {
          phase: 'job-fetch',
          progress: 100,
          message: 'Indlæsning fuldført'
        });
        console.log("fetchJob: Setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
      
      return job;
    } catch (error) {
      console.error("fetchJob: Error in fetchJob:", error);
      
      // Check if component unmounted during error handling
      if (!isMountedRef.current) {
        console.log("fetchJob: Component unmounted during error handling");
        return null;
      }
      
      // Determine if this is a network error
      const isNetworkError = !navigator.onLine || 
        (error instanceof Error && (
          error.message.includes('forbindelse') ||
          error.message.includes('timeout') ||
          error.message.includes('network')
        ));
      
      // Show appropriate toast
      toast(isNetworkError ? toastMessages.networkError : {
        title: "Fejl ved indlæsning",
        description: error instanceof Error ? error.message : "Der opstod en fejl under indlæsning. Prøv igen senere.",
        variant: "destructive",
      });
      
      // Only navigate for fatal network errors
      if (isNetworkError) {
        navigate("/dashboard");
      }
      
      safeSetState(setLoadingState, "idle");
      return null;
    } finally {
      // Always reset loadingState in finally block to ensure it happens
      if (isMountedRef.current) {
        console.log("fetchJob: Finalizing, setting loadingState to idle");
        safeSetState(setLoadingState, "idle");
      }
    }
  }, [navigate, toast, toastMessages, fetchWithTimeout, isMountedRef, safeSetState, setGeneratedLetter, setGenerationError, setGenerationPhase, setGenerationProgress, setLoadingState, setSelectedJob, setStep]);

  return { fetchJob };
};
