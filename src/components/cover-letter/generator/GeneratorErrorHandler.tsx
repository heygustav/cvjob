
import React from "react";
import { GeneratorErrorState } from "../GeneratorErrorState";
import { GeneratorLoadingState } from "../GeneratorLoadingState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface GeneratorErrorHandlerProps {
  isGenerating: boolean;
  error: string | null;
  loadingState: string;
  generationPhase: string | null;
  generationProgress: any;
  user: any;
  subscriptionStatus: any;
  hasGeneratedLetter: boolean;
  resetError: () => void;
}

export const GeneratorErrorHandler: React.FC<GeneratorErrorHandlerProps> = ({
  isGenerating,
  error,
  loadingState,
  generationPhase,
  generationProgress,
  user,
  subscriptionStatus,
  hasGeneratedLetter,
  resetError
}) => {
  // Handle the case where we're generating
  if (isGenerating && !error) {
    return (
      <GeneratorLoadingState
        isGenerating={isGenerating}
        loadingState={loadingState}
        generationPhase={generationPhase}
        resetError={resetError}
      />
    );
  }

  // Handle error state
  if (error) {
    return <GeneratorErrorState message={error} onRetry={resetError} />;
  }

  // Handle subscription limitations
  if (subscriptionStatus && !subscriptionStatus.canGenerate && !hasGeneratedLetter) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Abonnement påkrævet
          </h1>
          <p className="text-muted-foreground">
            Du har opbrugt dine gratis ansøgninger
          </p>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Abonnement påkrævet</AlertTitle>
          <AlertDescription>
            Du har opbrugt dine gratis ansøgninger. For at fortsætte med at generere 
            ansøgninger, skal du opgradere til et abonnement.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link to="/abonnement">
              Se abonnementer <ArrowUpRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // If we reach here, no specific error or loading condition was met
  return null;
};
