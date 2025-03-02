
import React from "react";
import SaveButton from "./SaveButton";
import SubmitButton from "./SubmitButton";

interface FormActionsProps {
  isLoading: boolean;
  isSaving?: boolean;
  showSaveButton?: boolean;
  onSave?: (e: React.MouseEvent) => Promise<void>;
  elapsedTime?: string; // Added elapsedTime as an optional prop
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  isSaving = false,
  showSaveButton = false,
  onSave,
  elapsedTime = "" // Default to empty string if not provided
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        {showSaveButton && (
          <SaveButton 
            onClick={onSave} 
            disabled={isLoading} 
            isLoading={isSaving} 
          />
        )}
      </div>
      <div>
        <SubmitButton isLoading={isLoading} elapsedTime={elapsedTime} />
      </div>
    </div>
  );
};

export default FormActions;
