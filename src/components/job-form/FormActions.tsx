
import React from "react";
import SubmitButton from "./SubmitButton";

interface FormActionsProps {
  isLoading: boolean;
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  className
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 ${className || ''}`}>
      <SubmitButton 
        isLoading={isLoading} 
        elapsedTime="0.00"
        className="w-full"
      />
    </div>
  );
};

export default FormActions;
