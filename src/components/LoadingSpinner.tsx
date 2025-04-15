
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  ariaLabel?: string;
  showDelay?: number; // Delay in ms before showing spinner (prevents flashing for quick loads)
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Indlæser...",
  progress,
  className,
  size = "md",
  fullPage = false,
  ariaLabel,
  showDelay = 0
}) => {
  const [visible, setVisible] = useState(showDelay === 0);
  
  useEffect(() => {
    if (showDelay > 0) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, showDelay);
      return () => clearTimeout(timer);
    }
  }, [showDelay]);
  
  // If still in delay period and not visible, render nothing
  if (!visible) {
    return null;
  }
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center space-y-4 text-center p-4",
    fullPage && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
    className
  );

  // Calculate a readable aria label
  const accessibilityLabel = ariaLabel || 
    (progress !== undefined ? `Loading, ${progress}% complete` : message);

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={accessibilityLabel}
    >
      <Loader2 
        className={cn(
          "animate-spin text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]", 
          sizeClasses[size]
        )} 
        aria-hidden="true"
      />
      
      {message && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{message}</p>
      )}
      
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            aria-hidden="true"
          >
            <span className="sr-only">{progress}% færdig</span>
          </div>
        </div>
      )}
    </div>
  );
};
