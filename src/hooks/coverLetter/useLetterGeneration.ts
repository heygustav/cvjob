
import { useCallback } from "react";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchJobById, fetchUserProfile, saveOrUpdateJob, saveCoverLetter } from "@/services/coverLetter/database";
import { generateCoverLetter } from "@/services/coverLetter/generator";
import { JobFormData } from "@/services/coverLetter/types";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkUtils } from "./useNetworkUtils";
import { GenerationProgress } from "./types";

const TIMEOUT_DURATION = 60000; // 1 minute

export const useLetterGeneration = (
  user: User | null,
  generationAttemptRef: React.MutableRefObject<number>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  selectedJob: JobPosting | null,
  loadingState: string
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { createError } = useNetworkUtils();

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    // Validate user login
    if (!user) {
      toast(toastMessages.loginRequired);
      return;
    }

    // Guard against multiple submissions
    if (loadingState !== "idle") {
      toast(toastMessages.generationInProgress);
      return;
    }

    // Form validation
    if (!jobData.title || !jobData.company || !jobData.description) {
      toast(toastMessages.missingFields);
      return;
    }

    // Cancel any in-progress generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Clear any previous errors
    safeSetState(setGenerationError, null);
    safeSetState(setGenerationPhase, null);

    // Initial setup
    safeSetState(setGenerationProgress, {
      phase: 'job-save',
      progress: 10,
      message: 'Forbereder generering...'
    });

    // Increment generation attempt counter
    generationAttemptRef.current += 1;
    const currentAttempt = generationAttemptRef.current;
    console.log(`Starting generation attempt #${currentAttempt}`);

    // Set initial loading state
    safeSetState(setLoadingState, "generating");

    // Create a timeout promise for the entire generation process
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Generation timed out. Prøv igen senere.'));
      }, TIMEOUT_DURATION);
      
      // Store the timeout ID for cleanup
      (window as any).__generationTimeoutId = timeoutId;
    });

    // Create the generation promise
    const generationPromise = (async () => {
      try {
        // Step 1: Fetch user profile first to check completeness
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        safeSetState(setGenerationPhase, 'user-fetch');
        safeSetState(setGenerationProgress, {
          phase: 'user-fetch',
          progress: 20,
          message: 'Henter din profil...'
        });
        console.log("Step 1: Fetching user profile");
        
        let userInfo;
        try {
          userInfo = await fetchUserProfile(user.id);
          userInfo.email = user.email; // Ensure email is set from authenticated user
        } catch (error) {
          console.error("Error fetching user profile:", error);
          throw createError('user-fetch', 'Kunne ikke hente din profil. Prøv at opdatere siden.');
        }
        
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        console.log(`User profile fetched for ID: ${user.id}`, {
          hasName: !!userInfo.name,
          hasExperience: !!userInfo.experience,
          hasEducation: !!userInfo.education,
        });
        
        // Warn about incomplete profile but continue
        if (!userInfo.name || !userInfo.experience || !userInfo.education) {
          toast(toastMessages.incompleteProfile);
          // Note: We're continuing with generation despite incomplete profile
        }

        // Step 2: Save or update the job posting
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        safeSetState(setGenerationPhase, 'job-save');
        safeSetState(setGenerationProgress, {
          phase: 'job-save',
          progress: 40,
          message: 'Gemmer jobdetaljer...'
        });
        console.log("Step 2: Saving job posting");
        
        let jobId;
        try {
          jobId = await saveOrUpdateJob(jobData, user.id, selectedJob?.id);
        } catch (error) {
          console.error("Error saving job:", error);
          throw createError('job-save', 'Kunne ikke gemme jobdetaljer. Tjek din forbindelse og prøv igen.');
        }
        
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        console.log(`Job saved with ID: ${jobId}`);

        // Step 3: Generate letter content
        safeSetState(setGenerationPhase, 'generation');
        safeSetState(setGenerationProgress, {
          phase: 'generation',
          progress: 60,
          message: 'Genererer ansøgning...'
        });
        console.log("Step 3: Generating letter content");
        
        let content;
        try {
          content = await generateCoverLetter(jobData, userInfo);
        } catch (error) {
          console.error("Error generating letter:", error);
          throw createError('generation', 'AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.', false);
        }
        
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        console.log("Letter generated successfully, content length:", content?.length);

        // Step 4: Save the generated letter
        safeSetState(setGenerationPhase, 'letter-save');
        safeSetState(setGenerationProgress, {
          phase: 'letter-save',
          progress: 80,
          message: 'Gemmer ansøgning...'
        });
        console.log("Step 4: Saving letter");
        
        let letter;
        try {
          letter = await saveCoverLetter(user.id, jobId, content);
        } catch (error) {
          console.error("Error saving letter:", error);
          throw createError('letter-save', 'Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.');
        }
        
        if (!isMountedRef.current) throw new Error('Component unmounted');
        
        console.log(`Letter saved with ID: ${letter.id}`);

        // Update the job object first to ensure it has all necessary fields
        let updatedJob;
        try {
          updatedJob = await fetchJobById(jobId);
        } catch (error) {
          console.error("Error fetching updated job:", error);
          // Non-critical, use the existing job info
          updatedJob = { ...jobData, id: jobId, user_id: user.id };
        }
        
        // Final progress update
        safeSetState(setGenerationProgress, {
          phase: 'letter-save',
          progress: 100,
          message: 'Færdig!'
        });
        
        return { letter, job: updatedJob };
      } catch (error) {
        throw error;
      }
    })();

    try {
      // Race between generation and timeout
      const result = await Promise.race([generationPromise, timeoutPromise]);
      
      // Clear timeout
      if ((window as any).__generationTimeoutId) {
        clearTimeout((window as any).__generationTimeoutId);
        (window as any).__generationTimeoutId = null;
      }
      
      if (!isMountedRef.current) return;
      
      // Success handling
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast(toastMessages.letterGenerated);
      
    } catch (error) {
      console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
      
      // Clear timeout
      if ((window as any).__generationTimeoutId) {
        clearTimeout((window as any).__generationTimeoutId);
        (window as any).__generationTimeoutId = null;
      }
      
      if (!isMountedRef.current) return;
      
      let title = "Fejl ved generering";
      let description = "Der opstod en ukendt fejl. Prøv venligst igen.";
      let recoverable = true;
      
      // Check if component was unmounted
      if (error instanceof Error && error.message === 'Component unmounted') {
        console.log("Generation cancelled due to component unmount");
        return;
      }
      
      // Check if it was a timeout error
      if (error instanceof Error && error.message.includes('timed out')) {
        toast(toastMessages.generationTimeout);
        safeSetState(setGenerationError, "Generering tog for lang tid. Prøv igen senere.");
        return;
      }
      
      // Handle typed errors with phases
      if ((error as any).phase) {
        const typedError = error as any;
        recoverable = typedError.recoverable;
        
        switch (typedError.phase) {
          case 'job-save':
            description = "Kunne ikke gemme jobinformation. Tjek venligst din forbindelse.";
            break;
          case 'user-fetch':
            description = "Kunne ikke hente din profilinformation. Prøv at opdatere din profil.";
            break;
          case 'generation':
            title = "Generering mislykkedes";
            description = "AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.";
            break;
          case 'letter-save':
            description = "Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.";
            break;
        }
      } else if (error instanceof Error) {
        // Handle regular errors
        description = error.message;
        
        // Check for network-related errors
        const isNetworkError = !navigator.onLine || 
          error.message.includes('forbindelse') || 
          error.message.includes('timeout') ||
          error.message.includes('network');
        
        if (isNetworkError) {
          title = "Forbindelsesfejl";
          description = "Kontroller din internetforbindelse og prøv igen.";
        }
      }
      
      // Display toast with error details
      toast({
        title,
        description,
        variant: "destructive",
      });
      
      // Set error state for UI to show
      safeSetState(setGenerationError, description);
      
      // If not recoverable, navigate away
      if (!recoverable) {
        navigate("/dashboard");
      }
      
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
      }
      abortControllerRef.current = null;
    }
  }, [createError, loadingState, navigate, selectedJob, toast, toastMessages, user, abortControllerRef, generationAttemptRef, isMountedRef, safeSetState, setGeneratedLetter, setGenerationError, setGenerationPhase, setGenerationProgress, setLoadingState, setSelectedJob, setStep]);

  return { handleJobFormSubmit };
};
