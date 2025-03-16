
import React, { memo } from "react";
import { GeneratorStates } from "./GeneratorStates";
import { User } from "@/lib/types";
import { SubscriptionStatus } from "@/services/subscription/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";

interface GeneratorErrorHandlerProps {
  isGenerating: boolean;
  error: string | null;
  loadingState: string;
  generationPhase: string | null;
  generationProgress: GenerationProgress;
  user: User | null;
  subscriptionStatus: any;
  hasGeneratedLetter: boolean;
  resetError: () => void;
}

export const GeneratorErrorHandler = memo(({
  isGenerating,
  error,
  loadingState,
  generationPhase,
  generationProgress,
  user,
  subscriptionStatus,
  hasGeneratedLetter,
  resetError,
}: GeneratorErrorHandlerProps) => {
  // Early return if there's no error, subscription issue, or generation in progress
  if (!isGenerating && !error && (!subscriptionStatus || subscriptionStatus.canGenerate || hasGeneratedLetter)) {
    return null;
  }

  return (
    <GeneratorStates
      isGenerating={isGenerating}
      error={error}
      loadingState={loadingState}
      generationPhase={generationPhase}
      user={user}
      subscriptionStatus={subscriptionStatus}
      hasGeneratedLetter={hasGeneratedLetter}
      resetError={resetError}
    />
  );
});

GeneratorErrorHandler.displayName = 'GeneratorErrorHandler';
