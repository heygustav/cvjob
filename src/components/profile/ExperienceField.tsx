
import React from "react";
import FormSection from "./FormSection";

interface ExperienceFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ExperienceField: React.FC<ExperienceFieldProps> = ({ value, onChange }) => {
  return (
    <FormSection 
      title="Erhvervserfaring"
      description="Inkluder dine jobtitler, virksomheder du har arbejdet for og hovedansvarsområder."
    >
      <textarea
        id="experience"
        name="experience"
        rows={4}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        placeholder="Beskriv din erhvervserfaring..."
      />
    </FormSection>
  );
};

export default ExperienceField;
