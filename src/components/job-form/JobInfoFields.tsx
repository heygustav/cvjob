
import React from "react";

interface JobInfoFieldsProps {
  title: string;
  company: string;
  contactPerson: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  errors?: Record<string, string>;
}

const JobInfoFields: React.FC<JobInfoFieldsProps> = ({
  title,
  company,
  contactPerson,
  onChange,
  disabled,
  errors = {},
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Jobtitel
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
            className={`mt-1 block w-full rounded-md ${
              errors.title ? 'border-red-300 ring-red-500' : 'border-gray-300'
            } shadow-sm focus:border-black focus:ring-black sm:text-sm`}
            placeholder="f.eks. Marketingansvarlig"
            disabled={disabled}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Virksomhed
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={company}
            onChange={onChange}
            required
            className={`mt-1 block w-full rounded-md ${
              errors.company ? 'border-red-300 ring-red-500' : 'border-gray-300'
            } shadow-sm focus:border-black focus:ring-black sm:text-sm`}
            placeholder="f.eks. Acme A/S"
            disabled={disabled}
          />
          {errors.company && (
            <p className="text-sm text-red-600 mt-1">{errors.company}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact_person"
          className="block text-sm font-medium text-gray-700"
        >
          Kontaktperson (Valgfri)
        </label>
        <input
          type="text"
          id="contact_person"
          name="contact_person"
          value={contactPerson}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder="f.eks. Jane Jensen"
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default JobInfoFields;
