
import React from "react";

interface EducationFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EducationField: React.FC<EducationFieldProps> = ({ value, onChange }) => {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="education"
        className="block text-sm font-medium text-gray-700"
      >
        Uddannelse
      </label>
      <div className="mt-1">
        <textarea
          id="education"
          name="education"
          rows={3}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="Beskriv din uddannelsesbaggrund..."
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        List dine grader, institutioner og afgangsår.
      </p>
    </div>
  );
};

export default EducationField;
