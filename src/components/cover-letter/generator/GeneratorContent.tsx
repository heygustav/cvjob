
import React, { lazy, Suspense, memo } from "react";
import { useGeneratorSetup } from "./useGeneratorSetup";
import { useLetterGeneration } from "./useLetterGeneration";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter } from "@/lib/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";
import { useGeneratorProps } from "./useGeneratorProps";
import { useLetterEdit } from "./useLetterEdit";
import { GeneratorStates } from "./GeneratorStates";
import { GeneratorStepRenderer } from "./GeneratorStepRenderer";

const GeneratorLayout = lazy(() => import("./GeneratorLayout"));

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

export const GeneratorContent = memo(({ 
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
    setJobData,
    setGeneratedLetter: hookSetGeneratedLetter,
    resetError: hookResetError,
  } = useGeneratorSetup(existingLetterId);

  const { handleGenerateLetter, handleEditContent } = useLetterGeneration({
    completeUser,
    setIsGenerating: (value) => {
      if (value !== hookIsGenerating) {
        hookStep(value ? 1 : 2);
      }
    },
    setLoadingState: () => {},
    setJobData,
    setSelectedJob: () => {},
    setGeneratedLetter: hookSetGeneratedLetter,
    setStep: hookStep,
    setError: () => {}
  });

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
    propSetStep, hookStep,
    propResetError, hookResetError,
    propHandleJobFormSubmit, handleGenerateLetter
  });
  
  const onEditContent = useLetterEdit({
    generatedLetter,
    propHandleEditLetter,
    handleEditContent,
    hookSetGeneratedLetter
  });

  const showStateHandlers = isGenerating || error || (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter);

  if (showStateHandlers) {
    return (
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
    );
  }

  return (
    <Suspense fallback={<div className="w-full flex justify-center items-center py-24">Loading...</div>}>
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

GeneratorContent.displayName = 'GeneratorContent';

export default GeneratorContent;
