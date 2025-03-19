
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FormActionsProps {
  isLoading: boolean;
  isFormValid?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isLoading, isFormValid = true }) => {
  // For cross-browser testing
  React.useEffect(() => {
    console.log("FormActions rendered in browser:", navigator.userAgent);
  }, []);

  return (
    <div className="pt-5">
      <div className="flex justify-end">
        {isLoading ? (
          <div className="relative">
            <Button
              type="button"
              disabled={true}
              className="inline-flex items-center bg-gray-400"
              aria-busy="true"
              aria-label="Gemmer profil"
              data-testid="save-profile-button-loading"
            >
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="status"
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
              <span className="text-white">Gemmer...</span>
            </Button>
            <span className="sr-only">Gemmer dine profiloplysninger</span>
          </div>
        ) : (
          <Button
            type="submit"
            className="inline-flex items-center"
            aria-busy={isLoading}
            aria-label="Gem profil"
            data-testid="save-profile-button"
            disabled={!isFormValid}
            title={!isFormValid ? "Udfyld venligst alle påkrævede felter korrekt" : "Gem dine profiloplysninger"}
          >
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Gem profil</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormActions;
