
import React from "react";

interface SkillsFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SkillsField: React.FC<SkillsFieldProps> = ({ value, onChange }) => {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="skills"
        className="block text-sm font-medium text-gray-700"
      >
        Skills & Qualifications
      </label>
      <div className="mt-1">
        <textarea
          id="skills"
          name="skills"
          rows={3}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="List your relevant skills and qualifications..."
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Include technical skills, certifications, languages, and
        other relevant qualifications.
      </p>
    </div>
  );
};

export default SkillsField;
