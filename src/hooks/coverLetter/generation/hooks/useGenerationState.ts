
import { useState } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { GenerationProgress, LoadingState } from "../../types";

export const useGenerationState = () => {
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

  // Derived state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";

  return {
    // State
    step,
    loadingState,
    selectedJob,
    generatedLetter,
    generationError,
    generationPhase,
    generationProgress,
    
    // Setters
    setStep,
    setLoadingState,
    setSelectedJob,
    setGeneratedLetter,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress,
    
    // Derived state
    isLoading,
    isGenerating
  };
};
