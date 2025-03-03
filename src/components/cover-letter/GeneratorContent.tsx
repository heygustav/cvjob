
import React, { useEffect, useState } from "react";
import { JobFormStep } from "./JobFormStep";
import { PreviewStep } from "./PreviewStep";
import { GeneratorHeader } from "./GeneratorHeader";
import { GeneratorLoadingState } from "./GeneratorLoadingState";
import { GeneratorErrorState } from "./GeneratorErrorState";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLetterGeneration } from "@/hooks/coverLetter/useLetterGeneration";
import { useLetterFetching } from "@/hooks/coverLetter/useLetterFetching";
import { useAuthContext } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionRequired from "../subscription/SubscriptionRequired";
import { useToastMessages } from "@/hooks/coverLetter/useToastMessages";
import { CoverLetter } from "@/lib/types";

interface GeneratorProps {
  existingLetterId?: string;
}

export const GeneratorContent: React.FC<GeneratorProps> = ({ existingLetterId }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const toastMessages = useToastMessages();
  
  const { 
    jobData, 
    setJobData, 
    generatedLetter, 
    setGeneratedLetter, 
    isLoading, 
    error, 
    handleGenerateLetter, 
    resetError,
    isGenerating,
    generationPhase,
    loadingState,
    handleEditContent
  } = useLetterGeneration();
  
  const { fetchLetterById } = useLetterFetching();
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription();

  // Fetch subscription status on mount
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
  }, [user?.id, fetchSubscriptionStatus]);

  // Handle existing letter
  useEffect(() => {
    const loadExistingLetter = async () => {
      if (existingLetterId && user?.id) {
        try {
          const letter = await fetchLetterById(existingLetterId);
          if (letter) {
            setGeneratedLetter(letter);
            setStep(2);
          }
        } catch (error) {
          console.error("Error fetching letter:", error);
        }
      }
    };

    loadExistingLetter();
  }, [existingLetterId, user?.id, fetchLetterById, setGeneratedLetter]);

  // Handle job ID from URL
  useEffect(() => {
    if (jobId && !existingLetterId) {
      navigate(`/generator?jobId=${jobId}`);
    }
  }, [jobId, existingLetterId, navigate]);

  // If subscription check is complete and user can't generate
  if (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter) {
    return (
      <div className="container py-8">
        <SubscriptionRequired 
          user={user} 
          freeGenerationsUsed={subscriptionStatus.freeGenerationsUsed}
          freeGenerationsAllowed={subscriptionStatus.freeGenerationsAllowed}
        />
      </div>
    );
  }

  // Show loading screen
  if (isGenerating) {
    return (
      <GeneratorLoadingState 
        isGenerating={isGenerating}
        loadingState={loadingState}
        generationPhase={generationPhase}
        resetError={resetError}
      />
    );
  }

  // Show error screen
  if (error) {
    return (
      <GeneratorErrorState 
        message={error} 
        onRetry={resetError} 
      />
    );
  }

  return (
    <div className="container py-8">
      <GeneratorHeader 
        step={step} 
        setStep={setStep} 
        hasGeneratedLetter={!!generatedLetter}
      />

      {step === 1 && (
        <JobFormStep
          jobData={jobData}
          setJobData={setJobData}
          onSubmit={handleGenerateLetter}
          isLoading={isLoading}
          user={user}
          initialJobId={searchParams.get("jobId") || undefined}
        />
      )}

      {step === 2 && generatedLetter && (
        <PreviewStep 
          generatedLetter={generatedLetter as CoverLetter} 
          onEdit={handleEditContent}
        />
      )}
    </div>
  );
};
