
import { useCallback } from "react";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkUtils } from "./useNetworkUtils";
import { GenerationProgress } from "./types";
import { useGenerationTracking } from "./useGenerationTracking";
import { useGenerationErrorHandling } from "./useGenerationErrorHandling";
import { useGenerationSteps } from "./useGenerationSteps";

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

  // Initialize generation tracking
  const { 
    incrementAttempt, 
    abortGeneration, 
    updatePhase 
  } = useGenerationTracking(
    isMountedRef, 
    safeSetState, 
    setGenerationPhase, 
    setGenerationProgress
  );

  // Initialize error handling
  const { 
    handleGenerationError 
  } = useGenerationErrorHandling(
    isMountedRef, 
    safeSetState, 
    setGenerationError, 
    setLoadingState
  );

  // Initialize generation steps
  const {
    fetchUserStep,
    saveJobStep,
    generateLetterStep,
    saveLetterStep,
    fetchUpdatedJobStep
  } = useGenerationSteps(
    user, 
    isMountedRef, 
    updatePhase, 
    abortControllerRef
  );

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    // Validate user login
    if (!user) {
      console.error("Cannot generate letter: No authenticated user");
      toast(toastMessages.loginRequired);
      return;
    }

    // Guard against multiple submissions
    if (loadingState !== "idle") {
      console.warn("Generation already in progress, state:", loadingState);
      toast(toastMessages.generationInProgress);
      return;
    }

    // Form validation
    if (!jobData.title || !jobData.company || !jobData.description) {
      console.error("Form validation failed: Missing required fields");
      toast(toastMessages.missingFields);
      return;
    }

    // Cancel any in-progress generation
    const abortController = abortGeneration();

    // Clear any previous errors
    safeSetState(setGenerationError, null);
    safeSetState(setGenerationPhase, null);

    // Initial setup
    updatePhase('job-save', 10, 'Forbereder generering...');

    // Increment generation attempt counter
    const currentAttempt = incrementAttempt();
    console.log(`Starting generation attempt #${currentAttempt} with job data:`, {
      title: jobData.title,
      company: jobData.company,
      descriptionLength: jobData.description?.length
    });

    // Set initial loading state
    safeSetState(setLoadingState, "generating");

    // Create a timeout promise for the entire generation process
    let timeoutId: number | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        console.error("Generation timed out after 60 seconds");
        reject(new Error('Generation timed out. Prøv igen senere.'));
      }, TIMEOUT_DURATION);
      
      // Store the timeout ID for cleanup
      (window as any).__generationTimeoutId = timeoutId;
    });

    // Create the generation promise
    const generationPromise = (async () => {
      try {
        // Step 1: Fetch user profile
        const userInfo = await fetchUserStep();
        
        if (!isMountedRef.current) {
          console.warn("Component unmounted after fetching user profile");
          throw new Error('Component unmounted');
        }
        
        // Warn about incomplete profile but continue
        if (!userInfo.name || !userInfo.experience || !userInfo.education) {
          console.warn("User profile incomplete:", {
            hasName: !!userInfo.name,
            hasExperience: !!userInfo.experience, 
            hasEducation: !!userInfo.education
          });
          toast(toastMessages.incompleteProfile);
          // Note: We're continuing with generation despite incomplete profile
        }

        // Step 2: Save or update the job posting
        const jobId = await saveJobStep(jobData, user.id, selectedJob?.id);

        // Step 3: Generate letter content
        const content = await generateLetterStep(jobData, userInfo);

        // Step 4: Save the generated letter
        const letter = await saveLetterStep(user.id, jobId, content);

        // Step 5: Update the job object 
        const updatedJob = await fetchUpdatedJobStep(jobId, jobData, user.id);
        
        // Final progress update
        updatePhase('letter-save', 100, 'Færdig!');
        
        return { letter, job: updatedJob };
      } catch (error) {
        console.error("Error in generation process:", error);
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
        timeoutId = null;
      }
      
      if (!isMountedRef.current) {
        console.warn("Component unmounted after generation completed");
        return;
      }
      
      // Success handling
      console.log("Generation completed successfully:", result);
      safeSetState(setSelectedJob, result.job);
      safeSetState(setGeneratedLetter, result.letter);
      safeSetState(setStep, 2);
      
      toast(toastMessages.letterGenerated);
      
    } catch (error) {
      handleGenerationError(error, currentAttempt, timeoutId);
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
      }
      abortControllerRef.current = null;
    }
  }, [
    abortControllerRef, 
    abortGeneration, 
    fetchUserStep, 
    fetchUpdatedJobStep, 
    generateLetterStep, 
    handleGenerationError, 
    incrementAttempt, 
    isMountedRef, 
    loadingState, 
    navigate, 
    safeSetState, 
    saveJobStep, 
    saveLetterStep, 
    selectedJob, 
    setGeneratedLetter, 
    setGenerationError, 
    setGenerationPhase, 
    setGenerationProgress, 
    setLoadingState, 
    setSelectedJob, 
    setStep, 
    toast, 
    toastMessages, 
    updatePhase, 
    user
  ]);

  return { handleJobFormSubmit };
};
