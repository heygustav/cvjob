
import { useState, useCallback, useRef } from "react";
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

export const useCoverLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const generationAttemptRef = useRef(0);

  const fetchJob = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      const job = await fetchJobById(id);
      
      if (!job) {
        toast({
          title: "Job ikke fundet",
          description: "Det valgte job kunne ikke findes.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return null;
      }

      setSelectedJob(job);

      try {
        const letters = await fetchLettersForJob(id);
        
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
      if (!navigator.onLine) {
        toast({
          title: "Ingen internetforbindelse",
          description: "Kontroller din internetforbindelse og prøv igen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning. Prøv igen senere.",
          variant: "destructive",
        });
      }
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  const fetchLetter = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      const letter = await fetchLetterById(id);
      
      if (!letter) {
        toast({
          title: "Ansøgning ikke fundet",
          description: "Den valgte ansøgning kunne ikke findes.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return null;
      }

      console.log("Fetched letter:", letter);
      setGeneratedLetter(letter);

      try {
        const job = await fetchJobById(letter.job_posting_id);
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
      if (!navigator.onLine) {
        toast({
          title: "Ingen internetforbindelse",
          description: "Kontroller din internetforbindelse og prøv igen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning. Prøv igen senere.",
          variant: "destructive",
        });
      }
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    if (!user) {
      toast({
        title: "Log ind krævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
        variant: "destructive",
      });
      return;
    }

    // Increment generation attempt counter
    generationAttemptRef.current += 1;
    const currentAttempt = generationAttemptRef.current;
    console.log(`Starting generation attempt #${currentAttempt}`);

    try {
      setIsGenerating(true);
      setIsLoading(true); // Also set general loading state
      
      // Step 1: Save or update the job posting
      const jobId = await saveOrUpdateJob(
        jobData, 
        user.id, 
        selectedJob?.id
      );
      console.log(`Job saved with ID: ${jobId}`);

      // Step 2: Fetch user profile
      const userInfo = await fetchUserProfile(user.id);
      userInfo.email = user.email; // Ensure email is set from authenticated user
      console.log(`User profile fetched for ID: ${user.id}`);

      // Step 3: Generate letter content
      console.log("Starting letter generation");
      const content = await generateCoverLetter(jobData, userInfo);
      console.log("Letter generated successfully");

      // Step 4: Save the generated letter
      const letter = await saveCoverLetter(user.id, jobId, content);
      console.log(`Letter saved with ID: ${letter.id}`);
      
      // Update the job object first to ensure it has all necessary fields
      const updatedJob = await fetchJobById(jobId);
      setSelectedJob(updatedJob);
      
      // Then set the generated letter
      setGeneratedLetter(letter);
      
      // Finally change the step after everything is ready
      setStep(2);

      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er blevet oprettet med succes.",
      });

    } catch (error) {
      console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
      
      let errorMessage = "Der opstod en ukendt fejl. Prøv venligst igen.";
      
      if (error instanceof Error) {
        errorMessage = `Der opstod en fejl: ${error.message}`;
        console.error(`Error details: ${error.stack}`);
      }
      
      if (!navigator.onLine) {
        errorMessage = "Kontroller din internetforbindelse og prøv igen.";
      }
      
      toast({
        title: "Fejl ved generering",
        description: errorMessage,
        variant: "destructive",
      });
      
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
  }, [selectedJob, toast, user, setStep]);

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!generatedLetter || !user) return;

    try {
      await updateLetterContent(generatedLetter.id, updatedContent);

      setGeneratedLetter({
        ...generatedLetter,
        content: updatedContent
      });

      toast({
        title: "Ansøgning opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (error) {
      console.error('Error updating letter:', error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af ansøgningen.",
        variant: "destructive",
      });
    }
  }, [generatedLetter, toast, user]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    });
  }, [navigate, toast]);

  return {
    step,
    isGenerating,
    isLoading,
    selectedJob,
    generatedLetter,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
  };
};
