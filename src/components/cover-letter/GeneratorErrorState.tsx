
import React from "react";
import ErrorDisplay from "../ErrorDisplay";

interface GeneratorErrorStateProps {
  errorMessage: string;
  resetError: () => void;
  generationPhase: any;
}

const GeneratorErrorState: React.FC<GeneratorErrorStateProps> = ({
  errorMessage,
  resetError,
  generationPhase
}) => {
  return (
    <ErrorDisplay
      title="Der opstod en fejl"
      message={errorMessage}
      onRetry={resetError}
      phase={generationPhase}
    />
  );
};

export default GeneratorErrorState;
