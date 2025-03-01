
import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className = "sm:col-span-6"
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500 italic">{description}</p>
      )}
    </div>
  );
};

export default FormSection;
