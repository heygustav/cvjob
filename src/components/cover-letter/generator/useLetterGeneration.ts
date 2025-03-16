
import { useState } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting } from "@/lib/types";

interface LetterGenerationHookProps {
  completeUser: any;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setJobData: React.Dispatch<React.SetStateAction<JobFormData>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
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
}: LetterGenerationHookProps) => {
  
  // Handle job form submission
  const handleGenerateLetter = async (data: JobFormData) => {
    setIsGenerating(true);
    setLoadingState("generating");
    setJobData(data);
    
    try {
      // Simulation of letter generation process
      // In a real app, you would call an API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update job data
      if (data.id) {
        setSelectedJob({
          ...data,
          id: data.id,
          user_id: completeUser?.id || "",
          created_at: new Date().toISOString()
        } as JobPosting);
      }
      
      // Create a mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: completeUser?.id || "",
        job_posting_id: data.id || Math.random().toString(36).substring(2, 15),
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${data.title} hos ${data.company}.\n\nMed venlig hilsen,\n${completeUser?.name || ""}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString() // Add the missing updated_at property
      };
      
      setGeneratedLetter(letter);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setIsGenerating(false);
      setLoadingState("idle");
    }
  };

  // Handle letter content edit
  const handleEditContent = async (content: string): Promise<void> => {
    setIsGenerating(true);
    try {
      // Update letter content logic would go here
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error("Error editing letter:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateLetter,
    handleEditContent,
  };
};
