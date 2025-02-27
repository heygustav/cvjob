
import React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={cn(
        "px-4 py-2 rounded-md shadow-sm text-sm font-bold text-white disabled:opacity-80 disabled:cursor-not-allowed transition-colors",
        className
      )}
      aria-label={isLoading ? "Genererer ansøgning..." : "Generer ansøgning"}
      style={{ 
        backgroundColor: '#4caf50', 
        color: 'white'
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          <span>Genererer ansøgning... {elapsedTime}</span>
        </span>
      ) : (
        "Generer ansøgning"
      )}
    </button>
  );
};

export default SubmitButton;
