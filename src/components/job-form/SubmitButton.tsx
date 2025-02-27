
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  elapsedTime: string;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  elapsedTime,
  className,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Track previous loading state to detect when loading completes
  useEffect(() => {
    if (isLoading === false && isSuccess === false) {
      setIsSuccess(true);
      
      // Reset success state after animation completes
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSuccess]);

  return (
    <button
      type="submit"
      disabled={isLoading || isSuccess}
      className={cn(
        "px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-80 disabled:cursor-not-allowed transition-all duration-300",
        isSuccess ? "bg-green-600 w-12" : "bg-primary hover:bg-primary-800",
        className
      )}
      aria-label={
        isLoading 
          ? "Genererer ansøgning..." 
          : isSuccess 
            ? "Ansøgning genereret" 
            : "Generer ansøgning nu"
      }
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          <span>Genererer ansøgning... {elapsedTime}</span>
        </span>
      ) : isSuccess ? (
        <Check className="h-5 w-5 mx-auto animate-scale-in text-white" />
      ) : (
        "Generer ansøgning nu"
      )}
    </button>
  );
};

export default SubmitButton;
