import React from "react";

interface JobInfoFieldsProps {
  title: string;
  company: string;
  contactPerson: string;
  deadline?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  errors: Record<string, string>;
}

const JobInfoFields: React.FC<JobInfoFieldsProps> = ({
  title,
  company,
  contactPerson,
  deadline,
  onChange,
  disabled,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Jobtitel <span className="text-rose-500">*</span>
          </label>
        </div>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md shadow-sm sm:text-sm placeholder:text-gray-400 ${
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
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Virksomhed <span className="text-rose-500">*</span>
          </label>
        </div>
        <input
          type="text"
          id="company"
          name="company"
          value={company}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md shadow-sm sm:text-sm placeholder:text-gray-400 ${
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

      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="contact_person"
            className="block text-sm font-medium text-gray-700"
          >
            Kontaktperson (Valgfri)
          </label>
        </div>
        <input
          type="text"
          id="contact_person"
          name="contact_person"
          value={contactPerson}
          onChange={onChange}
          disabled={disabled}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm placeholder:text-gray-400"
          placeholder="F.eks. Jane Doe, HR Manager"
        />
        <p className="mt-1 text-xs text-gray-400 italic">
          Navn på personen ansøgningen skal rettes til
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Ansøgningsfrist (Valgfri)
          </label>
        </div>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={deadline || ''}
          onChange={onChange}
          disabled={disabled}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm placeholder:text-gray-400"
          key={deadline ? 'date-with-value' : 'date-no-value'}
          min="1997-01-01"
          placeholder=" "
        />
        <p className="mt-1 text-xs text-gray-400 italic">
          Sidste frist for ansøgning
        </p>
      </div>
    </div>
  );
};

export default JobInfoFields;
