
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
  subscriptionStatus: SubscriptionStatus | null;
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
  // Don't render anything if there's no state to show
  if (!isGenerating && !error && 
      (!subscriptionStatus || (subscriptionStatus.canGenerate !== false) || hasGeneratedLetter)) {
    return null;
  }

  console.log("Rendering error handler with subscription status:", subscriptionStatus);

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
