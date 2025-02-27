
import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { GenerationStatus } from "../GenerationStatus";

interface GeneratorLoadingStateProps {
  isGenerating: boolean;
  loadingState: string;
  generationPhase: string | null;
  generationProgress?: {
    progress?: number;
    message?: string;
  };
  resetError: () => void;
}

const GeneratorLoadingState: React.FC<GeneratorLoadingStateProps> = ({
  isGenerating,
  loadingState,
  generationPhase,
  generationProgress,
  resetError
}) => {
  // Determine which loading message to show based on the current phase
  const getMessage = () => {
    if (isGenerating) {
      return generationPhase === 'user-fetch' ? "Henter brugerdata..." :
        generationPhase === 'job-save' ? "Gemmer jobdetaljer..." :
        generationPhase === 'generation' ? (generationProgress?.message || "Genererer ansøgning...") :
        generationPhase === 'letter-save' ? "Gemmer ansøgning..." : "Arbejder...";
    } else {
      return loadingState === "saving" ? "Gemmer ændringer..." : "Indlæser data...";
    }
  };

  const progress = generationProgress?.progress || 30;
  const message = getMessage();

  return <LoadingSpinner message={message} progress={progress} />;
};

export default GeneratorLoadingState;
