
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

// Use memo to prevent re-renders when props haven't changed
export const GeneratorStates: React.FC<GeneratorStatesProps> = memo(({
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
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  return (
    prevProps.isGenerating === nextProps.isGenerating &&
    prevProps.error === nextProps.error &&
    prevProps.loadingState === nextProps.loadingState &&
    prevProps.generationPhase === nextProps.generationPhase &&
    prevProps.hasGeneratedLetter === nextProps.hasGeneratedLetter &&
    prevProps.subscriptionStatus?.canGenerate === nextProps.subscriptionStatus?.canGenerate
  );
});
