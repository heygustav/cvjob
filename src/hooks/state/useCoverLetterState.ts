
/**
 * UI state hooks for cover letter operations
 * Responsible for managing UI state and user interactions
 */

import { useState, useCallback } from "react";
import { CoverLetter, JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "../coverLetter/types";

export type GeneratorStep = 1 | 2;
export type LoadingState = "idle" | "initializing" | "generating" | "saving";

/**
 * Hook to manage UI state for the cover letter generator
 */
export const useCoverLetterState = () => {
  // Core state
  const [step, setStep] = useState<GeneratorStep>(1);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Progress tracking
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  });
  
  // Computed state
  const isLoading = loadingState !== "idle";
  const isGenerating = loadingState === "generating";
  
  // Update progress information
  const updateProgress = useCallback((phase: string, progress: number, message: string) => {
    setGenerationPhase(phase);
    setGenerationProgress({
      phase: phase as any,
      progress,
      message
    });
  }, []);
  
  // Reset any error
  const resetError = useCallback(() => {
    setGenerationError(null);
  }, []);
  
  // Start job form submission process
  const startJobSubmission = useCallback((jobData: JobFormData) => {
    setLoadingState("generating");
    updateProgress("job-save", 10, "Starter generering...");
  }, [updateProgress]);
  
  // Complete job form submission process
  const completeJobSubmission = useCallback((job: JobPosting, letter: CoverLetter) => {
    setSelectedJob(job);
    setGeneratedLetter(letter);
    setStep(2);
    setLoadingState("idle");
    updateProgress("complete", 100, "Færdig!");
  }, [updateProgress]);
  
  // Handle generation error
  const handleGenerationError = useCallback((error: Error) => {
    setGenerationError(error.message);
    setLoadingState("idle");
    updateProgress("error", 0, "Fejl ved generering");
  }, [updateProgress]);
  
  return {
    // State
    step,
    selectedJob,
    generatedLetter,
    loadingState,
    generationError,
    generationPhase,
    generationProgress,
    isLoading,
    isGenerating,
    
    // Setters
    setStep,
    setSelectedJob,
    setGeneratedLetter,
    setLoadingState,
    setGenerationError,
    setGenerationPhase,
    setGenerationProgress,
    
    // Actions
    resetError,
    updateProgress,
    startJobSubmission,
    completeJobSubmission,
    handleGenerationError
  };
};
