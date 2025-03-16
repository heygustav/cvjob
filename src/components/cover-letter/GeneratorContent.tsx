
import React, { lazy, Suspense, memo } from "react";
import { useGeneratorSetup } from "./generator/useGeneratorSetup";
import { useLetterGeneration } from "./generator/useLetterGeneration";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";
import { useGeneratorProps } from "./generator/useGeneratorProps";
import { useLetterEdit } from "./generator/useLetterEdit";
import { GeneratorErrorHandler } from "./generator/GeneratorErrorHandler";
import { GeneratorStepRenderer } from "./generator/GeneratorStepRenderer";

// Lazy load non-critical components
const GeneratorLayout = lazy(() => import("./generator/GeneratorLayout").then(m => ({ default: m.GeneratorLayout })));

// Loading fallback with clear visual feedback
const ComponentLoader = () => (
  <div className="w-full py-16 flex justify-center items-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

interface GeneratorProps {
  existingLetterId?: string;
  step?: 1 | 2;
  isGenerating?: boolean;
  isLoading?: boolean;
  loadingState?: LoadingState;
  generationPhase?: string | null;
  generationProgress?: GenerationProgress;
  selectedJob?: any;
  generatedLetter?: CoverLetter | null;
  generationError?: string | null;
  setStep?: (step: 1 | 2) => void;
  handleJobFormSubmit?: (jobData: JobFormData) => Promise<void>;
  handleEditLetter?: (updatedContent: string) => Promise<void>;
  handleSaveJobAsDraft?: (jobData: JobFormData) => Promise<void>;
  resetError?: () => void;
}

export const GeneratorContent: React.FC<GeneratorProps> = memo(({ 
  existingLetterId,
  step: propStep,
  isGenerating: propIsGenerating,
  isLoading: propIsLoading,
  loadingState: propLoadingState,
  generationPhase: propGenerationPhase,
  generationProgress: propGenerationProgress,
  selectedJob: propSelectedJob,
  generatedLetter: propGeneratedLetter,
  generationError: propGenerationError,
  setStep: propSetStep,
  handleJobFormSubmit: propHandleJobFormSubmit,
  handleEditLetter: propHandleEditLetter,
  handleSaveJobAsDraft: propHandleSaveJobAsDraft,
  resetError: propResetError
}) => {
  // Use our custom hooks to separate logic if props are not provided
  const {
    step: hookStep,
    jobData,
    generatedLetter: hookGeneratedLetter,
    isLoading: hookIsLoading,
    error: hookError,
    isGenerating: hookIsGenerating,
    generationPhase: hookGenerationPhase,
    loadingState: hookLoadingState,
    selectedJob: hookSelectedJob,
    generationProgress: hookGenerationProgress,
    completeUser,
    subscriptionStatus,
    setStep: hookSetStep,
    setJobData,
    setGeneratedLetter: hookSetGeneratedLetter,
    resetError: hookResetError,
  } = useGeneratorSetup(existingLetterId);

  // Use the letter generation hook if props are not provided
  const { handleGenerateLetter, handleEditContent } = useLetterGeneration({
    completeUser,
    setIsGenerating: (value) => {
      if (value !== hookIsGenerating) {
        hookSetStep(value ? 1 : 2);
      }
    },
    setLoadingState: () => {}, // This is handled in useGeneratorSetup
    setJobData,
    setSelectedJob: () => {}, // This is handled in useGeneratorSetup
    setGeneratedLetter: hookSetGeneratedLetter,
    setStep: hookSetStep,
    setError: () => {} // This is handled in useGeneratorSetup
  });

  // Use our custom hooks to merge props and hook values
  const {
    step, 
    isGenerating, 
    isLoading, 
    loadingState, 
    generationPhase, 
    selectedJob,
    generatedLetter, 
    error, 
    generationProgress,
    setStepFn,
    resetErrorFn,
    handleJobFormSubmitFn
  } = useGeneratorProps({
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
  });
  
  // Use our custom hook for letter editing
  const onEditContent = useLetterEdit({
    generatedLetter,
    propHandleEditLetter: propHandleEditLetter,
    handleEditContent,
    hookSetGeneratedLetter
  });

  // Handle error states, generation states, and subscription issues
  const showErrorHandler = isGenerating || error || (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter);

  if (showErrorHandler) {
    return (
      <GeneratorErrorHandler
        isGenerating={isGenerating}
        error={error}
        loadingState={loadingState}
        generationPhase={generationPhase}
        generationProgress={generationProgress}
        user={completeUser}
        subscriptionStatus={subscriptionStatus}
        hasGeneratedLetter={!!generatedLetter}
        resetError={resetErrorFn}
      />
    );
  }

  return (
    <Suspense fallback={<ComponentLoader />}>
      <GeneratorLayout
        step={step}
        setStep={setStepFn}
        hasGeneratedLetter={!!generatedLetter}
      >
        <GeneratorStepRenderer
          step={step}
          jobData={jobData}
          setJobData={setJobData}
          generatedLetter={generatedLetter}
          isLoading={isLoading}
          user={completeUser}
          initialJobId={new URLSearchParams(window.location.search).get("jobId") || undefined}
          selectedJob={selectedJob}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
          generationProgress={generationProgress}
          resetError={resetErrorFn}
          handleJobFormSubmit={handleJobFormSubmitFn}
          handleEditContent={onEditContent}
          handleSaveJobAsDraft={propHandleSaveJobAsDraft}
        />
      </GeneratorLayout>
    </Suspense>
  );
});

// Add displayName for debugging
GeneratorContent.displayName = 'GeneratorContent';

export default GeneratorContent;
