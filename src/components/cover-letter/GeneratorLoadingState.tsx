
import React from "react";
import { GenerationPhase, LoadingState } from "@/hooks/coverLetter/types";
import { GenerationProgressIndicator } from "@/components/GenerationProgressIndicator";

export interface GeneratorLoadingStateProps {
  isGenerating: boolean;
  loadingState: LoadingState;
  generationPhase: GenerationPhase;
  resetError: () => void;
}

export const GeneratorLoadingState: React.FC<GeneratorLoadingStateProps> = ({
  isGenerating,
  loadingState,
  generationPhase,
  resetError
}) => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Genererer din ansøgning
        </h1>
        <p className="text-muted-foreground">
          Vi arbejder på at skabe den perfekte ansøgning til dig
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <GenerationProgressIndicator 
          loading={isGenerating} 
          phase={generationPhase} 
          state={loadingState} 
        />
      </div>
    </div>
  );
};
