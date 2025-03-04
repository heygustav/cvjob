
import React from "react";
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

export const GeneratorStates: React.FC<GeneratorStatesProps> = ({
  isGenerating,
  error,
  loadingState,
  generationPhase,
  user,
  subscriptionStatus,
  hasGeneratedLetter,
  resetError,
}) => {
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

  // If subscription check is complete and user can't generate
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
};
