
import { useMemo } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";

interface UseGeneratorPropsArgs {
  propStep?: 1 | 2;
  hookStep: 1 | 2;
  propIsGenerating?: boolean;
  hookIsGenerating: boolean;
  propIsLoading?: boolean;
  hookIsLoading: boolean;
  propLoadingState?: string;
  hookLoadingState: string;
  propGenerationPhase?: string | null;
  hookGenerationPhase: string | null;
  propGenerationProgress?: any;
  hookGenerationProgress: any;
  propSelectedJob?: any;
  hookSelectedJob: any;
  propGeneratedLetter?: CoverLetter | null;
  hookGeneratedLetter: CoverLetter | null;
  propGenerationError?: string | null;
  hookError: string | null;
  propSetStep?: (step: 1 | 2) => void;
  hookSetStep: (step: 1 | 2) => void;
  propResetError?: () => void;
  hookResetError: () => void;
  propHandleJobFormSubmit?: (jobData: JobFormData) => Promise<void>;
  handleGenerateLetter: (jobData: JobFormData) => Promise<void>;
}

export const useGeneratorProps = ({
  propStep, hookStep,
  propIsGenerating, hookIsGenerating,
  propIsLoading, hookIsLoading,
  propLoadingState, hookLoadingState,
  propGenerationPhase, hookGenerationPhase,
  propGenerationProgress, hookGenerationProgress,
  propSelectedJob, hookSelectedJob,
  propGeneratedLetter, hookGeneratedLetter,
  propGenerationError, hookError,
  propSetStep, hookSetStep,
  propResetError, hookResetError,
  propHandleJobFormSubmit, handleGenerateLetter
}: UseGeneratorPropsArgs) => {
  
  // Memoize merged props to prevent unnecessary re-renders
  return useMemo(() => ({
    step: propStep ?? hookStep,
    isGenerating: propIsGenerating ?? hookIsGenerating,
    isLoading: propIsLoading ?? hookIsLoading,
    loadingState: propLoadingState ?? hookLoadingState,
    generationPhase: propGenerationPhase ?? hookGenerationPhase,
    selectedJob: propSelectedJob ?? hookSelectedJob,
    generatedLetter: propGeneratedLetter ?? hookGeneratedLetter,
    error: propGenerationError ?? hookError,
    generationProgress: propGenerationProgress ?? hookGenerationProgress,
    setStepFn: propSetStep ?? hookSetStep,
    resetErrorFn: propResetError ?? hookResetError,
    handleJobFormSubmitFn: propHandleJobFormSubmit ?? handleGenerateLetter
  }), [
    propStep, hookStep,
    propIsGenerating, hookIsGenerating,
    propIsLoading, hookIsLoading,
    propLoadingState, hookLoadingState,
    propGenerationPhase, hookGenerationPhase,
    propGenerationProgress, hookGenerationProgress,
    propSelectedJob, hookSelectedJob,
    propGeneratedLetter, hookGeneratedLetter,
    propGenerationError, hookError,
    propSetStep, hookSetStep,
    propResetError, hookResetError,
    propHandleJobFormSubmit, handleGenerateLetter
  ]);
};
