
import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
  disabled: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isSaving, 
  disabled 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSaving}
      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
    >
      {isSaving ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Gemmer...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Gem jobopslag
        </>
      )}
    </button>
  );
};

export default SaveButton;
