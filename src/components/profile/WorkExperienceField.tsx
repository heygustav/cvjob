
import React from "react";

interface WorkExperienceFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const WorkExperienceField: React.FC<WorkExperienceFieldProps> = ({ value, onChange }) => {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="experience"
        className="block text-sm font-medium text-gray-700"
      >
        Work Experience
      </label>
      <div className="mt-1">
        <textarea
          id="experience"
          name="experience"
          rows={4}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="Describe your work experience..."
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Include your job titles, companies you've worked for, and key
        responsibilities.
      </p>
    </div>
  );
};

export default WorkExperienceField;
