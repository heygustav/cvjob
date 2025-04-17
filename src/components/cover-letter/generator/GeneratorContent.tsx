
import React, { lazy, Suspense, memo } from "react";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";
import { GeneratorProvider } from "./context/GeneratorContext";
import { useGeneratorInitialization } from "./hooks/useGeneratorInitialization";
import { useGeneratorOperations } from "./hooks/useGeneratorOperations";
import { useGeneratorContext } from "./context/GeneratorContext";
import { GeneratorErrorHandler } from "./GeneratorErrorHandler";
import { GeneratorStepRenderer } from "./GeneratorStepRenderer";

// Lazy load non-critical components
const GeneratorLayout = lazy(() => import("./GeneratorLayout").then(m => ({ default: m.GeneratorLayout })));

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

// Wrapper component that provides context
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
  return (
    <GeneratorProvider
      initialLetterId={existingLetterId}
      initialStep={propStep}
      initialIsGenerating={propIsGenerating}
      initialIsLoading={propIsLoading}
      initialLoadingState={propLoadingState}
      initialGenerationPhase={propGenerationPhase}
      initialGenerationProgress={propGenerationProgress}
      initialSelectedJob={propSelectedJob}
      initialGeneratedLetter={propGeneratedLetter}
      initialGenerationError={propGenerationError}
    >
      <GeneratorContentInner
        existingLetterId={existingLetterId}
        propSetStep={propSetStep}
        propHandleJobFormSubmit={propHandleJobFormSubmit}
        propHandleEditLetter={propHandleEditLetter}
        propHandleSaveJobAsDraft={propHandleSaveJobAsDraft}
        propResetError={propResetError}
      />
    </GeneratorProvider>
  );
});

// Inner component that consumes context
const GeneratorContentInner: React.FC<{
  existingLetterId?: string;
  propSetStep?: (step: 1 | 2) => void;
  propHandleJobFormSubmit?: (jobData: JobFormData) => Promise<void>;
  propHandleEditLetter?: (updatedContent: string) => Promise<void>;
  propHandleSaveJobAsDraft?: (jobData: JobFormData) => Promise<void>;
  propResetError?: () => void;
}> = memo(({
  existingLetterId,
  propSetStep,
  propHandleJobFormSubmit,
  propHandleEditLetter,
  propHandleSaveJobAsDraft,
  propResetError
}) => {
  // Get state from context
  const { state } = useGeneratorContext();
  const {
    step,
    jobData,
    isLoading,
    error,
    isGenerating,
    generationPhase,
    loadingState,
    selectedJob,
    generatedLetter,
    generationProgress,
    completeUser,
    subscriptionStatus
  } = state;

  // Initialize with the existing letter ID
  useGeneratorInitialization(existingLetterId);

  // Get operations from the hook
  const {
    setStep: hookSetStep,
    setJobData,
    resetError: hookResetError,
    handleGenerateLetter,
    handleEditContent
  } = useGeneratorOperations();

  // Use props functions if provided, otherwise use hook functions
  const setStepFn = propSetStep || hookSetStep;
  const resetErrorFn = propResetError || hookResetError;
  const handleJobFormSubmitFn = propHandleJobFormSubmit || handleGenerateLetter;
  const handleEditContentFn = propHandleEditLetter || handleEditContent;

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
          handleEditContent={handleEditContentFn}
          handleSaveJobAsDraft={propHandleSaveJobAsDraft}
        />
      </GeneratorLayout>
    </Suspense>
  );
});

// Add displayName for debugging
GeneratorContent.displayName = 'GeneratorContent';
GeneratorContentInner.displayName = 'GeneratorContentInner';

export default GeneratorContent;
