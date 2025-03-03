
import React from "react";
import JobFormStep from "./JobFormStep";
import { GeneratorLayout } from "./generator/GeneratorLayout";
import { GeneratorStates } from "./generator/GeneratorStates";
import { LetterPreviewStep } from "./LetterPreviewStep";
import { useGeneratorSetup } from "./generator/useGeneratorSetup";
import { useLetterGeneration } from "./generator/useLetterGeneration";

interface GeneratorProps {
  existingLetterId?: string;
}

export const GeneratorContent: React.FC<GeneratorProps> = ({ existingLetterId }) => {
  // Use our custom hooks to separate logic
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
    generationProgress,
    completeUser,
    subscriptionStatus,
    setStep,
    setJobData,
    setGeneratedLetter,
    resetError,
  } = useGeneratorSetup(existingLetterId);

  // Use the letter generation hook
  const { handleGenerateLetter, handleEditContent } = useLetterGeneration({
    completeUser,
    setIsGenerating: (value) => {
      if (value !== isGenerating) {
        setStep(value ? 1 : 2);
      }
    },
    setLoadingState: () => {}, // This is handled in useGeneratorSetup
    setJobData,
    setSelectedJob: () => {}, // This is handled in useGeneratorSetup
    setGeneratedLetter,
    setStep,
    setError: () => {} // This is handled in useGeneratorSetup
  });

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
  if (generatorStates) {
    return generatorStates;
  }

  // Handle letter content edit
  const onEditContent = async (content: string) => {
    if (!generatedLetter) return;
    
    try {
      await handleEditContent(content);
      setGeneratedLetter({
        ...generatedLetter,
        content,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error updating letter:", err);
    }
  };

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
          onSubmit={handleGenerateLetter}
          isLoading={isLoading}
          user={completeUser}
          initialJobId={new URLSearchParams(window.location.search).get("jobId") || undefined}
          selectedJob={selectedJob}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
          generationProgress={generationProgress}
          resetError={resetError}
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
