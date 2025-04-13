
import { useState } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting } from "@/lib/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";

/**
 * Type definition for the generator's state
 */
interface GeneratorState {
  step: 1 | 2;
  jobData: JobFormData;
  generatedLetter: CoverLetter | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  generationPhase: string | null;
  loadingState: string;
  selectedJob: JobPosting | null;
  generationProgress: GenerationProgress;
}

/**
 * Hook that manages the state for the cover letter generator
 * Provides a centralized state management solution with clear initialization
 * and minimized state dependencies
 */
export const useGeneratorState = () => {
  // Initialize with a single state object for better predictability
  const [state, setState] = useState<GeneratorState>({
    step: 1,
    jobData: {
      title: "",
      company: "",
      description: "",
    },
    generatedLetter: null,
    isLoading: false,
    error: null,
    isGenerating: false,
    generationPhase: null,
    loadingState: "idle",
    selectedJob: null,
    generationProgress: {
      phase: 'letter-save',
      progress: 0,
      message: 'Forbereder...'
    }
  });

  // Create individual setters for each state property to maintain convenience
  const setStep = (step: 1 | 2) => setState(prev => ({ ...prev, step }));
  const setJobData = (jobData: JobFormData) => setState(prev => ({ ...prev, jobData }));
  const setGeneratedLetter = (generatedLetter: CoverLetter | null) => setState(prev => ({ ...prev, generatedLetter }));
  const setIsLoading = (isLoading: boolean) => setState(prev => ({ ...prev, isLoading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error }));
  const setIsGenerating = (isGenerating: boolean) => setState(prev => ({ ...prev, isGenerating }));
  const setGenerationPhase = (generationPhase: string | null) => setState(prev => ({ ...prev, generationPhase }));
  const setLoadingState = (loadingState: string) => setState(prev => ({ ...prev, loadingState }));
  const setSelectedJob = (selectedJob: JobPosting | null) => setState(prev => ({ ...prev, selectedJob }));
  const setGenerationProgress = (generationProgress: GenerationProgress) => setState(prev => ({ ...prev, generationProgress }));
  
  // Reset any error
  const resetError = () => {
    setState(prev => ({
      ...prev,
      error: null,
      isGenerating: false,
      loadingState: "idle"
    }));
  };

  // Destructure state for easier access by consumers of this hook
  const {
    step,
    jobData,
    generatedLetter,
    isLoading,
    error,
    isGenerating,
    generationPhase,
    loadingState,
    selectedJob,
    generationProgress
  } = state;

  return {
    // State values
    step,
    jobData,
    generatedLetter,
    isLoading,
    error,
    isGenerating,
    generationPhase,
    loadingState,
    selectedJob,
    generationProgress,
    
    // State setters
    setStep,
    setJobData,
    setGeneratedLetter,
    setIsLoading,
    setError,
    setIsGenerating,
    setGenerationPhase,
    setLoadingState,
    setSelectedJob,
    setGenerationProgress,
    
    // Utility functions
    resetError,
  };
};
