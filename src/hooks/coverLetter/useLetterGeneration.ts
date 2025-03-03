
import { useState, useCallback } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting } from "@/lib/types";

export const useLetterGeneration = () => {
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    description: ""
  });
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState("idle");

  // Handle job form submission
  const handleGenerateLetter = useCallback(async (data: JobFormData) => {
    setIsGenerating(true);
    setLoadingState("generating");
    setJobData(data);
    
    try {
      // Simulation of letter generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: "user123", // This would come from the authenticated user
        job_posting_id: data.id || Math.random().toString(36).substring(2, 15),
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${data.title} hos ${data.company}.\n\nMed venlig hilsen,\nAnsøger`,
        created_at: new Date().toISOString()
      };
      
      setGeneratedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setIsGenerating(false);
      setLoadingState("idle");
    }
  }, []);

  // Handle letter content edit
  const handleEditContent = async (content: string) => {
    if (!generatedLetter) return;
    
    setIsLoading(true);
    try {
      // Update letter content
      setGeneratedLetter({
        ...generatedLetter,
        content,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error updating letter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset any error
  const resetError = () => {
    setError(null);
    setIsGenerating(false);
    setLoadingState("idle");
  };

  return {
    jobData,
    setJobData,
    generatedLetter,
    setGeneratedLetter,
    isLoading,
    error,
    handleGenerateLetter,
    resetError,
    isGenerating,
    generationPhase,
    loadingState,
    handleEditContent
  };
};
