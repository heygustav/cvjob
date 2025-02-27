
import { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchJobById, 
  fetchLettersForJob, 
  fetchLetterById, 
  saveOrUpdateJob, 
  saveCoverLetter, 
  fetchUserProfile, 
  updateLetterContent 
} from "@/services/coverLetter/database";
import { generateCoverLetter } from "@/services/coverLetter/generator";
import { JobFormData } from "@/services/coverLetter/types";

// Add more specific error types
interface GenerationError extends Error {
  phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save';
  recoverable: boolean;
}

// Define loading state type
type LoadingState = "idle" | "initializing" | "generating" | "saving";

// Timeout utility for network requests
const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 15000) => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Forbindelsen tog for lang tid. Kontroller din internetforbindelse.'));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const useCoverLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const generationAttemptRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Derived state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";
  const isInitializing = loadingState === "initializing";

  // Memoize toast configurations
  const toastMessages = useMemo(() => ({
    networkError: {
      title: "Forbindelsesfejl",
      description: "Kontroller din internetforbindelse og prøv igen.",
      variant: "destructive" as const,
    },
    jobNotFound: {
      title: "Job ikke fundet",
      description: "Det valgte job kunne ikke findes.",
      variant: "destructive" as const,
    },
    letterNotFound: {
      title: "Ansøgning ikke fundet",
      description: "Den valgte ansøgning kunne ikke findes.",
      variant: "destructive" as const,
    },
    letterGenerated: {
      title: "Ansøgning genereret",
      description: "Din ansøgning er blevet oprettet med succes.",
    },
    letterUpdated: {
      title: "Ansøgning opdateret",
      description: "Dine ændringer er blevet gemt.",
    },
    letterSaved: {
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    },
    missingFields: {
      title: "Manglende information",
      description: "Udfyld venligst jobtitel, virksomhed og beskrivelse.",
      variant: "destructive" as const,
    },
    generationInProgress: {
      title: "Generation i gang",
      description: "Vent venligst mens din ansøgning genereres.",
    },
    loginRequired: {
      title: "Log ind krævet",
      description: "Du skal være logget ind for at generere en ansøgning.",
      variant: "destructive" as const,
    },
    incompleteProfile: {
      title: "Bemærk",
      description: "Udfyld venligst din profil for at få en bedre ansøgning.",
      variant: "default" as const,
    },
  }), []);

  // Helper for creating typed errors
  const createError = useCallback((phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save', message: string, recoverable: boolean = true): GenerationError => {
    const error = new Error(message) as GenerationError;
    error.phase = phase;
    error.recoverable = recoverable;
    return error;
  }, []);

  const fetchJob = useCallback(async (id: string) => {
    try {
      setLoadingState("initializing");
      setGenerationError(null);
      setGenerationPhase(null);
      
      console.log("Fetching job with ID:", id);
      
      // Try without timeout first to avoid unnecessary delays
      let job;
      try {
        job = await fetchJobById(id);
      } catch (directError) {
        console.warn("Direct fetch failed, retrying with timeout:", directError);
        // Fallback to timeout version if direct fetch fails
        job = await fetchWithTimeout(fetchJobById(id));
      }
      
      if (!job) {
        toast(toastMessages.jobNotFound);
        navigate("/dashboard");
        return null;
      }

      console.log("Successfully fetched job:", job);
      setSelectedJob(job);

      try {
        // Try without timeout first
        let letters;
        try {
          letters = await fetchLettersForJob(id);
        } catch (directError) {
          console.warn("Direct letters fetch failed, retrying with timeout:", directError);
          letters = await fetchWithTimeout(fetchLettersForJob(id));
        }
        
        if (letters && letters.length > 0) {
          console.log("Found existing letters for job:", letters[0]);
          setGeneratedLetter(letters[0]);
          setStep(2);
        } else {
          console.log("No existing letters found, starting at step 1");
          setStep(1);
        }
      } catch (letterError) {
        console.error("Error fetching letters:", letterError);
        // Non-critical error, continue
      }
      
      return job;
    } catch (error) {
      console.error("Error in fetchJob:", error);
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
      setLoadingState("idle");
    }
  }, [navigate, toast, toastMessages]);

  const fetchLetter = useCallback(async (id: string) => {
    try {
      setLoadingState("initializing");
      setGenerationError(null);
      setGenerationPhase(null);
      
      console.log("Fetching letter with ID:", id);
      
      // Try without timeout first
      let letter;
      try {
        letter = await fetchLetterById(id);
      } catch (directError) {
        console.warn("Direct letter fetch failed, retrying with timeout:", directError);
        letter = await fetchWithTimeout(fetchLetterById(id));
      }
      
      if (!letter) {
        toast(toastMessages.letterNotFound);
        navigate("/dashboard");
        return null;
      }

      console.log("Fetched letter:", letter);
      setGeneratedLetter(letter);

      try {
        // Try without timeout first for the job fetch
        let job;
        try {
          job = await fetchJobById(letter.job_posting_id);
        } catch (directError) {
          console.warn("Direct job fetch for letter failed, retrying with timeout:", directError);
          job = await fetchWithTimeout(fetchJobById(letter.job_posting_id));
        }
        
        if (job) {
          console.log("Fetched job for letter:", job);
          setSelectedJob(job);
        } else {
          console.error("Job not found for letter:", letter.job_posting_id);
        }
      } catch (jobError) {
        console.error("Error fetching job for letter:", jobError);
        // Non-critical error, continue
      }
      
      setStep(2);
      return letter;
    } catch (error) {
      console.error("Error in fetchLetter:", error);
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
      setLoadingState("idle");
    }
  }, [navigate, toast, toastMessages]);

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
    setGenerationError(null);
    setGenerationPhase(null);

    // Increment generation attempt counter
    generationAttemptRef.current += 1;
    const currentAttempt = generationAttemptRef.current;
    console.log(`Starting generation attempt #${currentAttempt}`);

    // Set initial loading state
    setLoadingState("generating");

    try {
      // Step 1: Fetch user profile first to check completeness
      setGenerationPhase('user-fetch');
      console.log("Step 1: Fetching user profile");
      
      let userInfo;
      try {
        userInfo = await fetchWithTimeout(fetchUserProfile(user.id));
        userInfo.email = user.email; // Ensure email is set from authenticated user
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw createError('user-fetch', 'Kunne ikke hente din profil. Prøv at opdatere siden.');
      }
      
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
      setGenerationPhase('job-save');
      console.log("Step 2: Saving job posting");
      
      let jobId;
      try {
        jobId = await fetchWithTimeout(
          saveOrUpdateJob(jobData, user.id, selectedJob?.id)
        );
      } catch (error) {
        console.error("Error saving job:", error);
        throw createError('job-save', 'Kunne ikke gemme jobdetaljer. Tjek din forbindelse og prøv igen.');
      }
      
      console.log(`Job saved with ID: ${jobId}`);

      // Step 3: Generate letter content
      setGenerationPhase('generation');
      console.log("Step 3: Generating letter content");
      
      let content;
      try {
        content = await fetchWithTimeout(
          generateCoverLetter(jobData, userInfo),
          60000 // Longer timeout for generation (60 seconds)
        );
      } catch (error) {
        console.error("Error generating letter:", error);
        throw createError('generation', 'AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.', false);
      }
      
      console.log("Letter generated successfully, content length:", content?.length);

      // Step 4: Save the generated letter
      setGenerationPhase('letter-save');
      console.log("Step 4: Saving letter");
      
      let letter;
      try {
        letter = await fetchWithTimeout(
          saveCoverLetter(user.id, jobId, content)
        );
      } catch (error) {
        console.error("Error saving letter:", error);
        throw createError('letter-save', 'Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.');
      }
      
      console.log(`Letter saved with ID: ${letter.id}`);
      
      // Update the job object first to ensure it has all necessary fields
      let updatedJob;
      try {
        updatedJob = await fetchWithTimeout(fetchJobById(jobId));
      } catch (error) {
        console.error("Error fetching updated job:", error);
        // Non-critical, use the existing job info
        updatedJob = { ...jobData, id: jobId, user_id: user.id };
      }
      
      setSelectedJob(updatedJob);
      
      // Then set the generated letter
      setGeneratedLetter(letter);
      
      // Finally change the step after everything is ready
      setStep(2);

      toast(toastMessages.letterGenerated);

    } catch (error) {
      console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
      
      let title = "Fejl ved generering";
      let description = "Der opstod en ukendt fejl. Prøv venligst igen.";
      let recoverable = true;
      
      // Handle typed errors with phases
      if ((error as GenerationError).phase) {
        const typedError = error as GenerationError;
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
      setGenerationError(description);
      
      // If not recoverable, navigate away
      if (!recoverable) {
        navigate("/dashboard");
      }
      
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      setLoadingState("idle");
      abortControllerRef.current = null;
    }
  }, [createError, loadingState, navigate, selectedJob, toast, toastMessages, user]);

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!generatedLetter || !user) return;

    try {
      setLoadingState("saving");
      await fetchWithTimeout(updateLetterContent(generatedLetter.id, updatedContent));

      setGeneratedLetter({
        ...generatedLetter,
        content: updatedContent
      });

      toast(toastMessages.letterUpdated);
    } catch (error) {
      console.error('Error updating letter:', error);
      const isNetworkError = !navigator.onLine || 
        (error instanceof Error && error.message.includes('forbindelse'));
      
      toast({
        title: "Fejl ved opdatering",
        description: isNetworkError 
          ? "Kontroller din internetforbindelse og prøv igen."
          : "Der opstod en fejl under opdatering af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
    }
  }, [generatedLetter, toast, toastMessages, user]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast(toastMessages.letterSaved);
  }, [navigate, toast, toastMessages]);

  const resetError = useCallback(() => {
    setGenerationError(null);
    setGenerationPhase(null);
  }, []);

  return {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    selectedJob,
    generatedLetter,
    generationError,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
    resetError,
  };
};
