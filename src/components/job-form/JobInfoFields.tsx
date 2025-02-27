
import React from "react";

interface JobInfoFieldsProps {
  title: string;
  company: string;
  contactPerson: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  errors: Record<string, string>;
}

const JobInfoFields: React.FC<JobInfoFieldsProps> = ({
  title,
  company,
  contactPerson,
  onChange,
  disabled,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Jobtitel <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            errors.title
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-black focus:ring-black"
          }`}
          placeholder="F.eks. Marketing Manager"
          aria-invalid={errors.title ? "true" : "false"}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600" id="title-error">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Virksomhed <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={company}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            errors.company
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-black focus:ring-black"
          }`}
          placeholder="F.eks. Acme Inc."
          aria-invalid={errors.company ? "true" : "false"}
          aria-describedby={errors.company ? "company-error" : undefined}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-600" id="company-error">
            {errors.company}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="contact_person"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Kontaktperson (Valgfri)
        </label>
        <input
          type="text"
          id="contact_person"
          name="contact_person"
          value={contactPerson}
          onChange={onChange}
          disabled={disabled}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="F.eks. Jane Doe, HR Manager"
        />
        <p className="mt-1 text-xs text-gray-500">
          Navn på personen ansøgningen skal rettes til
        </p>
      </div>
    </div>
  );
};

export default JobInfoFields;
