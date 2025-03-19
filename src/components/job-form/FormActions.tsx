
import React from "react";
import SaveButton from "./SaveButton";
import SubmitButton from "./SubmitButton";

interface FormActionsProps {
  isLoading: boolean;
  isSaving?: boolean;
  showSaveButton?: boolean;
  onSave?: (e: React.MouseEvent) => Promise<void>;
  elapsedTime?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  isSaving = false,
  showSaveButton = false,
  onSave,
  elapsedTime = ""
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
        <SubmitButton isLoading={isLoading} elapsedTime={elapsedTime} className="h-10 px-4" />
      </div>
    </div>
  );
};

export default FormActions;
