
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FormActionsProps {
  isLoading: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isLoading }) => {
  return (
    <div className="pt-5">
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center"
          aria-busy={isLoading}
          aria-label={isLoading ? "Gemmer profil" : "Gem profil"}
          data-testid="save-profile-button"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              Gem profil
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
