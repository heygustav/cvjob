
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

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
  
  // Reset success state when component mounts to ensure we start in default state
  useEffect(() => {
    setIsSuccess(false);
  }, []);
  
  // Track previous loading state to detect when loading completes
  useEffect(() => {
    if (isLoading === false && isSuccess === false) {
      // Only set success if we were previously loading
      // This prevents the success state on initial render
      if (elapsedTime !== "") {
        setIsSuccess(true);
        
        // Reset success state after animation completes
        const timer = setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isSuccess, elapsedTime]);

  return (
    <button
      type="submit"
      disabled={isLoading || isSuccess}
      className={cn(
        "px-4 py-2 h-10 rounded-md shadow-sm text-sm font-medium text-white w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-0",
        isSuccess 
          ? "bg-green-600 w-12 h-10 sm:w-12" 
          : "bg-primary hover:bg-primary/90 active:bg-primary-800",
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
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="whitespace-nowrap">Genererer ansøgning... {elapsedTime}</span>
        </>
      ) : isSuccess ? (
        <Check className="h-5 w-5 mx-auto animate-scale-in text-white" />
      ) : (
        "Generer ansøgning nu"
      )}
    </button>
  );
};

export default SubmitButton;
