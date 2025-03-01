
import React from "react";
import FormSection from "./FormSection";

interface EducationFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EducationField: React.FC<EducationFieldProps> = ({ value, onChange }) => {
  return (
    <FormSection 
      title="Uddannelse"
      description="Angiv dine uddannelser, institutioner og dimissionsår."
    >
      <textarea
        id="education"
        name="education"
        rows={3}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        placeholder="Beskriv din uddannelsesmæssige baggrund..."
      />
    </FormSection>
  );
};

export default EducationField;
