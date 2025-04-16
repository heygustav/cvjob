
import React, { memo } from "react";
import { GeneratorLoadingState } from "../GeneratorLoadingState";
import { GeneratorErrorState } from "../GeneratorErrorState";
import SubscriptionRequired from "@/components/subscription/subscriptionRequired";
import { User } from "@/lib/types";
import { SubscriptionStatus } from "@/services/subscription/types";

interface GeneratorStatesProps {
  isGenerating: boolean;
  error: string | null;
  loadingState: string;
  generationPhase: string | null;
  user: User | null;
  subscriptionStatus: SubscriptionStatus | null;
  hasGeneratedLetter: boolean;
  resetError: () => void;
}

export const GeneratorStates = memo(({
  isGenerating,
  error,
  loadingState,
  generationPhase,
  user,
  subscriptionStatus,
  hasGeneratedLetter,
  resetError,
}) => {
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

  if (error) {
    return (
      <GeneratorErrorState 
        message={error} 
        onRetry={resetError} 
      />
    );
  }

  if (subscriptionStatus && !subscriptionStatus.canGenerate && !hasGeneratedLetter) {
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

  return null;
});

GeneratorStates.displayName = 'GeneratorStates';
