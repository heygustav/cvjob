
import { useState } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { LoadingState, GenerationProgress } from "../../types";

/**
 * Interface defining all state properties for generation
 */
interface GenerationState {
  step: 1 | 2;
  loadingState: LoadingState;
  selectedJob: JobPosting | null;
  generatedLetter: CoverLetter | null;
  generationError: string | null;
  generationPhase: string | null;
  generationProgress: GenerationProgress;
}

/**
 * Hook to manage generation state with a unified state object
 * for improved predictability and maintenance
 */
export const useGenerationState = () => {
  // Initialize a single state object containing all related state
  const [state, setState] = useState<GenerationState>({
    step: 1,
    loadingState: "idle",
    selectedJob: null,
    generatedLetter: null,
    generationError: null,
    generationPhase: null,
    generationProgress: {
      phase: 'job-save',
      progress: 0,
      message: 'Forbereder...'
    }
  });

  // Create setter functions for individual properties
  const setStep = (step: 1 | 2) => setState(prev => ({ ...prev, step }));
  const setLoadingState = (loadingState: LoadingState) => setState(prev => ({ ...prev, loadingState }));
  const setSelectedJob = (selectedJob: JobPosting | null) => setState(prev => ({ ...prev, selectedJob }));
  const setGeneratedLetter = (generatedLetter: CoverLetter | null) => setState(prev => ({ ...prev, generatedLetter }));
  const setGenerationError = (generationError: string | null) => setState(prev => ({ ...prev, generationError }));
  const setGenerationPhase = (generationPhase: string | null) => setState(prev => ({ ...prev, generationPhase }));
  const setGenerationProgress = (generationProgress: GenerationProgress) => setState(prev => ({ ...prev, generationProgress }));
  
  // Derived state properties
  const isLoading = state.loadingState !== "idle";
  const isGenerating = state.loadingState === "generating";

  return {
    // State properties
    step: state.step,
    loadingState: state.loadingState,
    selectedJob: state.selectedJob,
    generatedLetter: state.generatedLetter,
    generationError: state.generationError,
    generationPhase: state.generationPhase,
    generationProgress: state.generationProgress,
    
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
