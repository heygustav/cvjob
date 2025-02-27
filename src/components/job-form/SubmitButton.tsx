
import React from "react";
import { Clock } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  elapsedTime: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, elapsedTime }) => {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Clock className="animate-pulse -ml-1 mr-2 h-4 w-4" />
            <span className="mr-2">Behandler... {elapsedTime}s</span>
            <span className="text-xs text-gray-200">
              Tålmodighed er det bedste mod...
            </span>
          </>
        ) : (
          "Generer ansøgning"
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
