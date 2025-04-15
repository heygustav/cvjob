
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCcw } from "lucide-react";
import { getErrorPhase, getErrorTitle } from "@/utils/errorHandling";

export interface GeneratorErrorStateProps {
  message: string;
  onRetry: () => void;
  phase?: string;
}

export const GeneratorErrorState: React.FC<GeneratorErrorStateProps> = ({
  message,
  onRetry,
  phase,
}) => {
  // Determine error phase
  const errorPhase = phase || getErrorPhase(new Error(message));
  const title = getErrorTitle(errorPhase as any);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">
          Vi kunne ikke generere din ansøgning
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center" role="alert" aria-live="assertive">
        <div className="mb-6 bg-red-50 p-4 rounded-full">
          <AlertTriangleIcon className="h-12 w-12 text-red-500" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-medium mb-2">Noget gik galt</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        <Button 
          onClick={onRetry}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Prøv igen at generere ansøgning"
        >
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Prøv igen
        </Button>
      </div>
    </div>
  );
};
