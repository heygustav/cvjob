import React, { lazy, Suspense, useMemo, memo } from "react";
import { useGeneratorSetup } from "./generator/useGeneratorSetup";
import { useLetterGeneration } from "./generator/useLetterGeneration";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";

// Lazy load non-critical components
const JobFormStep = lazy(() => import("./JobFormStep"));
const GeneratorLayout = lazy(() => import("./generator/GeneratorLayout").then(m => ({ default: m.GeneratorLayout })));
const GeneratorStates = lazy(() => import("./generator/GeneratorStates").then(m => ({ default: m.GeneratorStates })));
const LetterPreviewStep = lazy(() => import("./LetterPreviewStep"));

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
  selectedJob?: JobPosting | null;
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

  // Memoize merged props to prevent unnecessary re-renders
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
  } = useMemo(() => ({
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
    propSelectedJob, hookSelectedJob,
    propGeneratedLetter, hookGeneratedLetter,
    propGenerationError, hookError,
    propGenerationProgress, hookGenerationProgress,
    propSetStep, hookSetStep,
    propResetError, hookResetError,
    propHandleJobFormSubmit, handleGenerateLetter
  ]);
  
  // Memoize letter edit handler to prevent unnecessary re-renders
  const onEditContent = useMemo(() => async (content: string) => {
    if (!generatedLetter) return;
    
    if (propHandleEditLetter) {
      await propHandleEditLetter(content);
    } else {
      try {
        await handleEditContent(content);
        hookSetGeneratedLetter({
          ...generatedLetter,
          content,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error updating letter:", err);
      }
    }
  }, [generatedLetter, propHandleEditLetter, handleEditContent, hookSetGeneratedLetter]);

  // Early return for loading states to avoid rendering unnecessary components
  if ((isGenerating || error || (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter))) {
    return (
      <Suspense fallback={<ComponentLoader />}>
        <GeneratorStates 
          isGenerating={isGenerating}
          error={error}
          loadingState={loadingState}
          generationPhase={generationPhase}
          user={completeUser}
          subscriptionStatus={subscriptionStatus}
          hasGeneratedLetter={!!generatedLetter}
          resetError={resetErrorFn}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<ComponentLoader />}>
      <GeneratorLayout
        step={step}
        setStep={setStepFn}
        hasGeneratedLetter={!!generatedLetter}
      >
        {step === 1 && (
          <Suspense fallback={<ComponentLoader />}>
            <JobFormStep
              jobData={jobData}
              setJobData={setJobData}
              onSubmit={handleJobFormSubmitFn}
              isLoading={isLoading}
              user={completeUser}
              initialJobId={new URLSearchParams(window.location.search).get("jobId") || undefined}
              selectedJob={selectedJob}
              isGenerating={isGenerating}
              generationPhase={generationPhase}
              generationProgress={generationProgress}
              resetError={resetErrorFn}
              onSave={propHandleSaveJobAsDraft}
            />
          </Suspense>
        )}

        {step === 2 && generatedLetter && (
          <Suspense fallback={<ComponentLoader />}>
            <LetterPreviewStep 
              generatedLetter={generatedLetter} 
              onEdit={onEditContent}
            />
          </Suspense>
        )}
      </GeneratorLayout>
    </Suspense>
  );
});

// Add displayName for debugging
GeneratorContent.displayName = 'GeneratorContent';

export default GeneratorContent;
