
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCcw } from "lucide-react";

export interface GeneratorErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const GeneratorErrorState: React.FC<GeneratorErrorStateProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Der opstod en fejl
        </h1>
        <p className="text-muted-foreground">
          Vi kunne ikke generere din ansøgning
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 bg-red-50 p-4 rounded-full">
          <AlertTriangleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-medium mb-2">Noget gik galt</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        <Button onClick={onRetry}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Prøv igen
        </Button>
      </div>
    </div>
  );
};
