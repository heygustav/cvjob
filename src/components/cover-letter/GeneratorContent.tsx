
import React from "react";
import JobFormStep from "./JobFormStep";
import { GeneratorLayout } from "./generator/GeneratorLayout";
import { GeneratorStates } from "./generator/GeneratorStates";
import { LetterPreviewStep } from "./LetterPreviewStep";
import { useGeneratorSetup } from "./generator/useGeneratorSetup";
import { useLetterGeneration } from "./generator/useLetterGeneration";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";

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

export const GeneratorContent: React.FC<GeneratorProps> = ({ 
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

  // Use provided props or fallback to hook values
  const step = propStep ?? hookStep;
  const isGenerating = propIsGenerating ?? hookIsGenerating;
  const isLoading = propIsLoading ?? hookIsLoading;
  const loadingState = propLoadingState ?? hookLoadingState;
  const generationPhase = propGenerationPhase ?? hookGenerationPhase;
  const selectedJob = propSelectedJob ?? hookSelectedJob;
  const generatedLetter = propGeneratedLetter ?? hookGeneratedLetter;
  const error = propGenerationError ?? hookError;
  const generationProgress = propGenerationProgress ?? hookGenerationProgress;
  const setStep = propSetStep ?? hookSetStep;
  const resetError = propResetError ?? hookResetError;

  // Handle job form submission
  const handleJobFormSubmit = propHandleJobFormSubmit ?? handleGenerateLetter;
  
  // Handle letter content edit
  const onEditContent = async (content: string) => {
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
  };

  // Conditional rendering for different states
  const generatorStates = (
    <GeneratorStates 
      isGenerating={isGenerating}
      error={error}
      loadingState={loadingState}
      generationPhase={generationPhase}
      user={completeUser}
      subscriptionStatus={subscriptionStatus}
      hasGeneratedLetter={!!generatedLetter}
      resetError={resetError}
    />
  );

  // If any state component is shown, return that
  if ((isGenerating || error || (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter))) {
    return generatorStates;
  }

  return (
    <GeneratorLayout
      step={step}
      setStep={setStep}
      hasGeneratedLetter={!!generatedLetter}
    >
      {step === 1 && (
        <JobFormStep
          jobData={jobData}
          setJobData={setJobData}
          onSubmit={handleJobFormSubmit}
          isLoading={isLoading}
          user={completeUser}
          initialJobId={new URLSearchParams(window.location.search).get("jobId") || undefined}
          selectedJob={selectedJob}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
          generationProgress={generationProgress}
          resetError={resetError}
          onSave={propHandleSaveJobAsDraft}
        />
      )}

      {step === 2 && generatedLetter && (
        <LetterPreviewStep 
          generatedLetter={generatedLetter} 
          onEdit={onEditContent}
        />
      )}
    </GeneratorLayout>
  );
};
