
import React from "react";
import FormSection from "./FormSection";

interface SkillsFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SkillsField: React.FC<SkillsFieldProps> = ({ value, onChange }) => {
  return (
    <FormSection 
      title="Kompetencer & kvalifikationer"
      description="Inkluder tekniske kompetencer, certificeringer, sprog og andre relevante kvalifikationer."
    >
      <textarea
        id="skills"
        name="skills"
        rows={3}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        placeholder="Angiv dine relevante kompetencer og kvalifikationer..."
      />
    </FormSection>
  );
};

export default SkillsField;
