
import React from "react";
import SubmitButton from "./SubmitButton";
import SaveButton from "./SaveButton";

interface FormActionsProps {
  isLoading: boolean;
  isSaving: boolean;
  onSave: () => void;
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  isSaving,
  onSave,
  className
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 ${className || ''}`}>
      <SubmitButton 
        isLoading={isLoading} 
        elapsedTime="0.00"
        className="w-full sm:flex-1"
      />
      
      {!isLoading && (
        <SaveButton 
          onClick={onSave}
          isSaving={isSaving}
          disabled={isLoading}
        />
      )}
    </div>
  );
};

export default FormActions;
