
import { useCallback, useState } from "react";
import { User, CoverLetter, JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useToast } from "@/hooks/use-toast";

// Define types locally to avoid dependency on missing modules
type LoadingState = "idle" | "generating" | "initializing" | "saving";
type GenerationProgress = {
  phase: string;
  progress: number;
  message: string;
};

export const useCoverLetterGeneration = (user: User | null) => {
  // State management
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  });
  
  const { toast } = useToast();
  
  // Derived state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";
  const isInitializing = loadingState === "initializing";

  // Handle job form submission
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData) => {
    if (!user) {
      toast({
        title: "Login påkrævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
      });
      return;
    }

    setLoadingState("generating");
    setGenerationPhase("job-save");
    setGenerationProgress({
      phase: 'job-save',
      progress: 10,
      message: 'Forbereder generering...'
    });
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock job
      const job: JobPosting = {
        id: jobData.id || Math.random().toString(36).substring(2, 15),
        user_id: user.id,
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person || null,
        url: jobData.url || null,
        deadline: jobData.deadline || null,
        created_at: new Date().toISOString()
      };
      
      setSelectedJob(job);
      
      // Update progress
      setGenerationProgress({
        phase: 'letter-gen',
        progress: 50,
        message: 'Genererer ansøgning...'
      });
      
      // Simulate letter generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: user.id,
        job_posting_id: job.id,
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${jobData.title} hos ${jobData.company}.\n\nMed venlig hilsen,\n${user.name || ""}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGeneratedLetter(letter);
      setStep(2);
      
      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er blevet genereret med succes.",
      });
      
    } catch (err) {
      console.error("Generation error:", err);
      setGenerationError(err instanceof Error ? err.message : "Der opstod en fejl");
      
      toast({
        title: "Fejl",
        description: "Der opstod en fejl under genereringen. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
      setGenerationProgress({
        phase: 'complete',
        progress: 100,
        message: 'Færdig!'
      });
    }
  }, [user, toast]);

  // Handle letter edits
  const handleEditLetter = useCallback(async (updatedContent: string): Promise<void> => {
    if (!user || !generatedLetter) {
      console.error("Cannot edit letter: No user or letter");
      return;
    }

    setLoadingState("saving");
    
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedLetter({
        ...generatedLetter,
        content: updatedContent,
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Ændringer gemt",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (error) {
      console.error("Error editing letter:", error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
    }
  }, [user, generatedLetter, toast]);

  // Handle save letter
  const handleSaveLetter = useCallback((): void => {
    if (!generatedLetter) return;
    
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt.",
    });
  }, [generatedLetter, toast]);

  // Save job as draft
  const saveJobAsDraft = useCallback(async (jobData: JobFormData): Promise<string | null> => {
    if (!user) {
      console.error("Cannot save job: No authenticated user");
      toast({
        title: "Login påkrævet",
        description: "Du skal være logget ind for at gemme job.",
      });
      return null;
    }

    setLoadingState("saving");
    
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const jobId = jobData.id || Math.random().toString(36).substring(2, 15);
      
      toast({
        title: "Job gemt",
        description: "Jobbet er gemt som kladde.",
      });
      
      return jobId;
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl under gem. Prøv venligst igen.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoadingState("idle");
    }
  }, [user, toast]);

  // Reset error
  const resetError = useCallback((): void => {
    setGenerationError(null);
  }, []);

  // Fetch job by ID (simplified mockup)
  const fetchJob = useCallback(async (id: string): Promise<JobPosting | null> => {
    if (!user) return null;
    
    setLoadingState("initializing");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJob: JobPosting = {
        id,
        user_id: user.id,
        title: "Sample Job",
        company: "Sample Company",
        description: "Sample description",
        contact_person: null,
        url: null,
        deadline: null,
        created_at: new Date().toISOString()
      };
      
      setSelectedJob(mockJob);
      return mockJob;
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    } finally {
      setLoadingState("idle");
    }
  }, [user]);

  // Fetch letter by ID (simplified mockup)
  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!user) return null;
    
    setLoadingState("initializing");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLetter: CoverLetter = {
        id,
        user_id: user.id,
        job_posting_id: "sample-job-id",
        content: "Sample cover letter content",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGeneratedLetter(mockLetter);
      setStep(2);
      return mockLetter;
    } catch (error) {
      console.error("Error fetching letter:", error);
      return null;
    } finally {
      setLoadingState("idle");
    }
  }, [user]);

  return {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    generationProgress,
    selectedJob,
    generatedLetter,
    generationError,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError,
  };
};
