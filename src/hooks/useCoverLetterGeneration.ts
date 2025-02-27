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

// Timeout utility for network requests
const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 10000) => {
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const generationAttemptRef = useRef(0);

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
      variant: "default" as const, // Changed from "warning" to "default"
    },
  }), []);

  const fetchJob = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setGenerationError(null);
      
      // Use fetchWithTimeout to guard against network issues
      const job = await fetchWithTimeout(fetchJobById(id));
      
      if (!job) {
        toast(toastMessages.jobNotFound);
        navigate("/dashboard");
        return null;
      }

      setSelectedJob(job);

      try {
        const letters = await fetchWithTimeout(fetchLettersForJob(id));
        
        if (letters && letters.length > 0) {
          console.log("Found existing letters for job:", letters[0]);
          setGeneratedLetter(letters[0]);
          setStep(2);
        } else {
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
        (error instanceof Error && error.message.includes('forbindelse'));
      
      toast(isNetworkError ? toastMessages.networkError : {
        title: "Fejl ved indlæsning",
        description: error instanceof Error ? error.message : "Der opstod en fejl under indlæsning. Prøv igen senere.",
        variant: "destructive",
      });
      
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, toastMessages]);

  const fetchLetter = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setGenerationError(null);
      
      const letter = await fetchWithTimeout(fetchLetterById(id));
      
      if (!letter) {
        toast(toastMessages.letterNotFound);
        navigate("/dashboard");
        return null;
      }

      console.log("Fetched letter:", letter);
      setGeneratedLetter(letter);

      try {
        const job = await fetchWithTimeout(fetchJobById(letter.job_posting_id));
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
        (error instanceof Error && error.message.includes('forbindelse'));
      
      toast(isNetworkError ? toastMessages.networkError : {
        title: "Fejl ved indlæsning",
        description: error instanceof Error ? error.message : "Der opstod en fejl under indlæsning. Prøv igen senere.",
        variant: "destructive",
      });
      
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, toastMessages]);

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    // Validate user login
    if (!user) {
      toast(toastMessages.loginRequired);
      return;
    }

    // Guard against multiple submissions
    if (isGenerating || isLoading) {
      toast(toastMessages.generationInProgress);
      return;
    }

    // Form validation
    if (!jobData.title || !jobData.company || !jobData.description) {
      toast(toastMessages.missingFields);
      return;
    }

    // Clear any previous errors
    setGenerationError(null);

    // Increment generation attempt counter
    generationAttemptRef.current += 1;
    const currentAttempt = generationAttemptRef.current;
    console.log(`Starting generation attempt #${currentAttempt}`);

    try {
      setIsGenerating(true);
      setIsLoading(true); // Also set general loading state
      
      // Step 1: Fetch user profile first to check completeness
      const userInfo = await fetchWithTimeout(fetchUserProfile(user.id));
      userInfo.email = user.email; // Ensure email is set from authenticated user
      
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
      const jobId = await fetchWithTimeout(
        saveOrUpdateJob(jobData, user.id, selectedJob?.id)
      );
      console.log(`Job saved with ID: ${jobId}`);

      // Step 3: Generate letter content
      console.log("Starting letter generation");
      const content = await fetchWithTimeout(
        generateCoverLetter(jobData, userInfo),
        60000 // Longer timeout for generation (60 seconds)
      );
      console.log("Letter generated successfully");

      // Step 4: Save the generated letter
      const letter = await fetchWithTimeout(
        saveCoverLetter(user.id, jobId, content)
      );
      console.log(`Letter saved with ID: ${letter.id}`);
      
      // Update the job object first to ensure it has all necessary fields
      const updatedJob = await fetchWithTimeout(fetchJobById(jobId));
      setSelectedJob(updatedJob);
      
      // Then set the generated letter
      setGeneratedLetter(letter);
      
      // Finally change the step after everything is ready
      setStep(2);

      toast(toastMessages.letterGenerated);

    } catch (error) {
      console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
      
      let errorMessage = "Der opstod en ukendt fejl. Prøv venligst igen.";
      
      if (error instanceof Error) {
        errorMessage = `Der opstod en fejl: ${error.message}`;
        console.error(`Error details: ${error.stack}`);
      }
      
      const isNetworkError = !navigator.onLine || 
        (error instanceof Error && (
          error.message.includes('forbindelse') || 
          error.message.includes('timeout') ||
          error.message.includes('network')
        ));
      
      if (isNetworkError) {
        errorMessage = "Kontroller din internetforbindelse og prøv igen.";
      }
      
      toast({
        title: "Fejl ved generering",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set error state for UI to show
      setGenerationError(errorMessage);
      
      // Stay on the current page instead of navigating away
      // Only reset the states
      setIsGenerating(false);
      setIsLoading(false);
      
      // Don't navigate away on error
      return;
      
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      setIsGenerating(false);
      setIsLoading(false);
    }
  }, [isGenerating, isLoading, selectedJob, toast, toastMessages, user]);

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!generatedLetter || !user) return;

    try {
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
    }
  }, [generatedLetter, toast, toastMessages, user]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast(toastMessages.letterSaved);
  }, [navigate, toast, toastMessages]);

  const resetError = useCallback(() => {
    setGenerationError(null);
  }, []);

  return {
    step,
    isGenerating,
    isLoading,
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
