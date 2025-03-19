
import React from "react";

interface PersonalInfoSummaryProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PersonalInfoSummary: React.FC<PersonalInfoSummaryProps> = ({ value, onChange }) => {
  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="summary"
        className="block text-sm font-medium text-gray-700"
      >
        Kort beskrivelse
      </label>
      <div className="mt-1">
        <textarea
          id="summary"
          name="summary"
          rows={2}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="En kort beskrivelse om dig selv..."
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        En kort beskrivelse der vil vises under dit navn i dit CV.
      </p>
    </div>
  );
};

export default PersonalInfoSummary;
