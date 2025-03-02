
import React from "react";
import SubmitButton from "./SubmitButton";
import { useTimer } from "./useTimer";

interface FormActionsProps {
  isLoading: boolean;
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  className
}) => {
  const { formattedTime } = useTimer(isLoading);

  return (
    <div className={`flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-6 ${className || ''}`}>
      <SubmitButton 
        isLoading={isLoading} 
        elapsedTime={formattedTime}
        className="w-full sm:w-auto text-sm sm:text-base focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default FormActions;
