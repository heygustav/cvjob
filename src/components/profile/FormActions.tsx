
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading: boolean;
  isFormValid?: boolean;
}

// Using memo to prevent unnecessary re-renders
const FormActions: React.FC<FormActionsProps> = React.memo(({ isLoading, isFormValid = true }) => {
  // Performance measurement for mounts
  React.useEffect(() => {
    const startTime = performance.now();
    console.log("FormActions rendered in browser:", navigator.userAgent);
    const mountTime = performance.now() - startTime;
    console.log(`FormActions mount time: ${mountTime.toFixed(2)}ms`);
    
    // End-to-end testing support - mark when component is ready
    if (typeof window !== 'undefined' && 'Cypress' in window) {
      // @ts-ignore - For Cypress testing
      window.formActionsReady = true;
    }
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
              data-state="loading"
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
            data-state={isFormValid ? "enabled" : "disabled"}
          >
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Gem profil</span>
          </Button>
        )}
      </div>
    </div>
  );
});

FormActions.displayName = "FormActions";

export default FormActions;
