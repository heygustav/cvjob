
import React, { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className = "sm:col-span-6",
  titleClassName = "block text-sm font-medium text-gray-700",
  descriptionClassName = "mt-2 text-sm text-gray-500 italic"
}) => {
  return (
    <div className={className}>
      <label className={titleClassName}>
        {title}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {description && (
        <p className={descriptionClassName}>{description}</p>
      )}
    </div>
  );
};

export default FormSection;
