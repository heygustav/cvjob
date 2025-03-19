
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Indlæser...",
  progress,
  className,
  size = "md",
  fullPage = false
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center space-y-4 text-center",
    fullPage && "fixed inset-0 bg-background/80 z-50",
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
