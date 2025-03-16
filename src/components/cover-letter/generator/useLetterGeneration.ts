
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";

interface LetterGenerationProps {
  completeUser: any;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setJobData: React.Dispatch<React.SetStateAction<JobFormData>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<any>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useLetterGeneration = ({
  completeUser,
  setIsGenerating,
  setLoadingState,
  setJobData,
  setSelectedJob,
  setGeneratedLetter,
  setStep,
  setError
}: LetterGenerationProps) => {
  const { toast } = useToast();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to start the timer
  const startTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
    }
    
    setElapsedTime(0);
    
    const newTimer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimer(newTimer);
  }, [timer]);

  // Function to stop the timer
  const stopTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  // Format the elapsed time as MM:SS
  const formatElapsedTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Handle job form submission
  const handleGenerateLetter = useCallback(async (data: JobFormData) => {
    setIsGenerating(true);
    setLoadingState("generating");
    setJobData(data);
    startTimer();
    
    try {
      // Simulate the letter generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update job data
      if (data.id) {
        setSelectedJob({
          ...data,
          id: data.id,
          user_id: completeUser?.id || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Create a mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: completeUser?.id || "",
        job_posting_id: data.id || Math.random().toString(36).substring(2, 15),
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${data.title} hos ${data.company}.\n\nMed venlig hilsen,\n${completeUser?.name || ""}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGeneratedLetter(letter);
      setStep(2);
      
      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er nu klar til gennemsyn.",
      });
    } catch (err) {
      console.error("Error generating letter:", err);
      setError(err instanceof Error ? err.message : "Der opstod en fejl");
      
      toast({
        title: "Fejl ved generering",
        description: err instanceof Error ? err.message : "Der opstod en fejl ved generering af ansøgningen",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setLoadingState("idle");
      stopTimer();
    }
  }, [completeUser, setError, setGeneratedLetter, setIsGenerating, setJobData, setLoadingState, setSelectedJob, setStep, startTimer, stopTimer, toast]);

  // Handle letter content edit
  const handleEditContent = useCallback(async (content: string): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call to update letter content
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update letter locally
      setGeneratedLetter(prev => prev ? {
        ...prev,
        content,
        updated_at: new Date().toISOString()
      } : null);
      
      toast({
        title: "Ansøgning opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (err) {
      console.error("Error editing letter:", err);
      
      toast({
        title: "Fejl ved opdatering",
        description: err instanceof Error ? err.message : "Der opstod en fejl ved opdatering af ansøgningen",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [setGeneratedLetter, setIsGenerating, toast]);

  return {
    handleGenerateLetter,
    handleEditContent,
    elapsedTime: formatElapsedTime(elapsedTime),
  };
};
