
import React, { useState } from "react";
import JobFormStep from "@/components/cover-letter/JobFormStep";
import PreviewStep from "@/components/cover-letter/PreviewStep";
import GeneratorErrorState from "@/components/cover-letter/GeneratorErrorState";
import GeneratorLoadingState from "@/components/cover-letter/GeneratorLoadingState";
import GeneratorHeader from "@/components/cover-letter/GeneratorHeader";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionRequired from "@/components/subscription/SubscriptionRequired";

interface GeneratorContentProps {
  initialLoading: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  loadingState: string;
  step: 1 | 2;
  generationPhase: string | null;
  generationProgress: any;
  generationError: string | null;
  selectedJob: JobPosting | null;
  generatedLetter: CoverLetter | null;
  setStep: (step: 1 | 2) => void;
  resetError: () => void;
  handleJobFormSubmit: (jobData: JobFormData) => Promise<void>;
  handleEditLetter: (content: string) => Promise<void>;
  handleSaveJobAsDraft: (jobData: JobFormData) => Promise<void>;
}

const GeneratorContent: React.FC<GeneratorContentProps> = ({
  initialLoading,
  isLoading,
  isGenerating,
  loadingState,
  step,
  generationPhase,
  generationProgress,
  generationError,
  selectedJob,
  generatedLetter,
  setStep,
  resetError,
  handleJobFormSubmit,
  handleEditLetter,
  handleSaveJobAsDraft,
}) => {
  const { user } = useAuth();
  const { subscriptionStatus, canGenerateLetter, recordGeneration } = useSubscription(user);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleSubmit = async (jobData: JobFormData) => {
    if (!user) return;
    
    // Check if user can generate letter
    if (!canGenerateLetter()) {
      setShowSubscription(true);
      return;
    }
    
    // Record generation before proceeding
    await recordGeneration(user.id);
    
    // Proceed with letter generation
    await handleJobFormSubmit(jobData);
  };

  if (initialLoading || isLoading) {
    return <GeneratorLoadingState />;
  }

  if (generationError) {
    return (
      <GeneratorErrorState
        error={generationError}
        onRetry={resetError}
      />
    );
  }

  // Show subscription requirement if needed and user doesn't have access
  if (showSubscription && user && subscriptionStatus && !subscriptionStatus.hasActiveSubscription && 
      subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <GeneratorHeader 
          step={1} 
          setStep={setStep} 
          isLoading={isLoading} 
          hasGeneratedLetter={!!generatedLetter}
        />
        <div className="mt-6">
          <SubscriptionRequired 
            user={user}
            freeGenerationsUsed={subscriptionStatus.freeGenerationsUsed}
            freeGenerationsAllowed={subscriptionStatus.freeGenerationsAllowed}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <GeneratorHeader 
        step={step} 
        setStep={setStep} 
        isLoading={isLoading} 
        hasGeneratedLetter={!!generatedLetter}
      />
      
      {step === 1 ? (
        <JobFormStep
          selectedJob={selectedJob}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
          generationProgress={generationProgress}
          resetError={resetError}
          onSubmit={handleSubmit}
          onSave={handleSaveJobAsDraft}
        />
      ) : (
        <PreviewStep
          generatedLetter={generatedLetter}
          onEditContent={handleEditLetter}
        />
      )}
    </div>
  );
};

export default GeneratorContent;
