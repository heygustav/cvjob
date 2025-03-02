
import React from "react";
import SaveButton from "./SaveButton";
import SubmitButton from "./SubmitButton";

interface FormActionsProps {
  isLoading: boolean;
  isSaving?: boolean;
  showSaveButton?: boolean;
  onSave?: (e: React.MouseEvent) => Promise<void>;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  isSaving = false,
  showSaveButton = false,
  onSave
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
        <SubmitButton isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FormActions;
